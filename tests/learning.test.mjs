import test from "node:test";
import assert from "node:assert/strict";
import {
  lessons,
  paths,
  defaults,
  progressFor,
  stats,
  emailValid,
  applicationValid,
} from "../dist/data.js";
test("both adopted paths have three complete lessons and valid knowledge checks", () => {
  assert.deepEqual(Object.keys(paths), ["digital", "career"]);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 6);
  for (const path of Object.keys(paths))
    assert.equal(lessons.filter((l) => l.path === path).length, 3);
  for (const l of lessons) {
    assert.equal(l.steps.length, 3);
    assert.equal(l.checklist.length, 4);
    for (const s of l.steps) {
      assert.ok(s.text && s.simple && s.example);
      assert.equal(s.choices.length, 3);
      assert.ok(s.answer >= 0 && s.answer < s.choices.length);
    }
  }
});
test("fresh learners have honest zero progress", () => {
  assert.deepEqual(stats({}), { completed: 0, started: 0, saved: 0 });
  assert.equal(progressFor({}, "email").complete, false);
});
test("completion counts reflect real lesson records", () => {
  assert.equal(
    stats({
      progress: {
        email: { complete: true },
        video: { complete: false },
        unknown: { complete: true },
      },
      saved: ["email"],
    }).completed,
    1,
  );
});
test("practice email rejects missing fields and wrong destinations", () => {
  const valid = {
    to: "careers@example.com",
    subject: "Résumé",
    message: "Please see my résumé.",
    attached: true,
  };
  assert.ok(emailValid(valid));
  for (const k of Object.keys(valid))
    assert.ok(!emailValid({ ...valid, [k]: "" }));
  assert.ok(!emailValid({ ...valid, to: "another@example.com" }));
  assert.ok(emailValid({ ...valid, to: " Careers@Example.com " }));
});
test("application requires valid contact information, attachment and reviewed consent", () => {
  const d = {
    name: "Jordan Ellis",
    email: "jordan@example.com",
    attached: true,
    consent: true,
  };
  assert.ok(applicationValid(d));
  for (const patch of [
    { email: "not an email" },
    { name: " " },
    { attached: false },
    { consent: false },
  ])
    assert.ok(!applicationValid({ ...d, ...patch }));
});
test("comfort defaults do not demand diagnosis or autoplay sound", () => {
  assert.equal(defaults.motion, true);
  assert.equal(defaults.sound, false);
  assert.equal(defaults.goal, "either");
  assert.ok(
    !Object.keys(defaults).some((x) => /diagnosis|condition|age/.test(x)),
  );
});
