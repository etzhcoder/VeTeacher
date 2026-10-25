export const lessons = [
  {
    id: "email",
    path: "digital",
    title: "Send an email attachment",
    short: "Email with confidence",
    description: "Write a message, attach a file, and check it before sending.",
    minutes: 6,
    icon: "mail",
    skill: "Sending files",
    steps: [
      {
        title: "Start with the right person",
        text: "The To field is the address of the person receiving your email. Check every letter before you send. For practice, we will write to careers@example.com.", // taste-skill-ignore: reserved domain required by safe practice exercise
        simple:
          "Put the recipient’s email address in the To box. Check the spelling.",
        example:
          "Think of the To field as the address on an envelope. The message needs the right destination.",
        question: "Where does the recipient’s email address go?",
        choices: [
          "In the subject line",
          "In the To field",
          "In the attachment",
        ],
        answer: 1,
      }, // taste-skill-ignore: reserved example domains are intentional teaching content
      {
        title: "Give your message a clear subject",
        text: "A subject is a short description of your message. “Résumé for operations role” tells the reader what to expect. In the message, explain why you are writing and mention your attachment.",
        simple:
          "The subject is the title of your email. Keep it short and specific.",
        example:
          "Subject: Résumé for operations role. Message: Hello, I have attached my résumé for your review. Thank you.",
        question: "Which subject tells the reader the most?",
        choices: ["Hello", "Important!!!", "Résumé for operations role"],
        answer: 2,
      },
      {
        title: "Attach, check, then send",
        text: "The paperclip button adds a file. Choose the right document, then check that its name appears in the message. Before sending, check the address, the message, and the file one more time.",
        simple:
          "Add the file. Look for its name. Check the recipient. Then send.",
        example:
          "If you mention “my résumé” but no file name appears, stop and attach your résumé first.",
        question: "What should you check before sending?",
        choices: [
          "The recipient, message, and attached file",
          "Only the subject",
          "Nothing if the email is short",
        ],
        answer: 0,
      },
    ],
    checklist: [
      "Check the recipient’s email address.",
      "Write a clear subject and a short message.",
      "Attach the correct file and verify its name.",
      "Review everything before sending.",
    ],
  },
  {
    id: "video",
    path: "digital",
    title: "Join a video call",
    short: "Feel ready for your next call",
    description: "Practice your microphone, camera, and call controls.",
    minutes: 5,
    icon: "video",
    skill: "Video calls",
    steps: [
      {
        title: "Check the invitation",
        text: "Find the meeting time and the link in your invitation. Only use a meeting link you expect from someone you trust. Open it a few minutes early so you have time to prepare.",
        simple: "Check who invited you, the meeting time, and the link.",
        example:
          "For an interview at 2:00, open the trusted meeting link a few minutes before 2:00.",
        question: "Which invitation should you open?",
        choices: [
          "Any link sent by a stranger",
          "An expected invitation from a trusted contact",
          "The first advertisement you see",
        ],
        answer: 1,
      },
      {
        title: "Choose how you join",
        text: "A preview lets you choose whether your microphone and camera are on. A line through a microphone usually means it is muted. Camera access is optional unless the meeting requires it.",
        simple:
          "Check your microphone and camera before joining. A crossed-out microphone means muted.",
        example:
          "Join a large group muted. Turn your microphone on when it is your turn to speak.",
        question: "What does a crossed-out microphone usually mean?",
        choices: [
          "Your sound is muted",
          "The call has ended",
          "Your camera is on",
        ],
        answer: 0,
      },
      {
        title: "Stay in control",
        text: "Look for mute, captions, and leave controls. Captions can help you follow the conversation, though they can contain mistakes. You can turn your camera off or leave when needed.",
        simple:
          "Use mute when you are not speaking. Turn on captions if helpful. Leave when finished.",
        example:
          "If background noise starts, mute yourself. If words are hard to follow, enable captions.",
        question: "Which control helps you read spoken words?",
        choices: ["Camera", "Leave", "Captions"],
        answer: 2,
      },
    ],
    checklist: [
      "Confirm the invitation and time.",
      "Check microphone and camera settings.",
      "Enable captions if they help.",
      "Find the mute and leave controls.",
    ],
  },
  {
    id: "scams",
    path: "digital",
    title: "Spot a suspicious message",
    short: "Pause before you click",
    description: "Look for warning signs and choose a safer next step.",
    minutes: 7,
    icon: "shield",
    skill: "Safer messaging",
    steps: [
      {
        title: "Notice pressure",
        text: "A message that demands immediate action can be trying to rush you. Threats, unexpected prizes, or requests to keep a payment secret are reasons to pause and check.",
        simple:
          "If a message pressures you to act now, pause. You can take time to check.",
        example:
          "“Pay within 10 minutes or lose your account” is pressure. It is not a reason to skip verification.",
        question: "What is the safest first response to a threatening message?",
        choices: [
          "Pay immediately",
          "Forward your password",
          "Pause and verify it independently",
        ],
        answer: 2,
      },
      {
        title: "Look beyond the display name",
        text: "A sender’s name can be misleading. Inspect the actual address and link destination. Do not share passwords or verification codes in response to an unexpected message.",
        simple:
          "A familiar name does not prove a message is real. Check the address. Keep passwords and codes private.",
        example:
          "A sender can call themselves “Support” while using an unrelated email address.",
        question: "Does a familiar display name prove who sent the message?",
        choices: [
          "Yes, always",
          "No, names can be copied",
          "Only if it includes a logo",
        ],
        answer: 1,
      },
      {
        title: "Use a separate trusted route",
        text: "If a message claims to be from an organization, open its known website yourself or use a trusted phone number. Avoid the message’s link or phone number while checking. Report or delete a suspicious message.",
        simple:
          "Open the organization’s website yourself. Use contact details you already trust.",
        example:
          "For an account alert, open your saved app directly instead of following the link in the message.",
        question: "How should you check an unexpected account alert?",
        choices: [
          "Reply with your verification code",
          "Call the number in the suspicious message",
          "Open the known official app or website yourself",
        ],
        answer: 2,
      },
    ],
    checklist: [
      "Pause when a message creates pressure.",
      "Check the sender and the actual link.",
      "Keep passwords and verification codes private.",
      "Verify using a separate trusted contact route.",
    ],
  },
  {
    id: "resume",
    path: "career",
    title: "Translate your experience",
    short: "Put your experience into words",
    description: "Turn responsibilities into clear civilian résumé statements.",
    minutes: 8,
    icon: "briefcase",
    skill: "Describing experience",
    steps: [
      {
        title: "Start with what you actually did",
        text: "List a responsibility you held and the actions you took. Use details you can share publicly. Leave out classified, sensitive, or private information.",
        simple:
          "Choose a real responsibility. Describe what you did in everyday language.",
        example:
          "Instead of an unfamiliar unit abbreviation, say “coordinated equipment checks for a team.”",
        question: "What belongs in a résumé statement?",
        choices: [
          "Sensitive operational details",
          "Only military abbreviations",
          "A clear description of work you can share publicly",
        ],
        answer: 2,
      },
      {
        title: "Connect it to the role",
        text: "Read the job description. Look for matching skills such as organization, maintenance, training, customer service, or teamwork. Describe the overlap honestly without claiming a qualification you do not have.",
        simple:
          "Find a skill the job needs that you have used. Explain the connection honestly.",
        example:
          "Scheduling vehicle inspections can demonstrate planning and recordkeeping for an operations role.",
        question: "What is a good way to connect experience to a job?",
        choices: [
          "Use relevant skills you actually have",
          "Claim every qualification listed",
          "Copy the whole job description",
        ],
        answer: 0,
      },
      {
        title: "Show action and a result",
        text: "A useful structure is: action + responsibility + result. Add a number only if you can verify it. A specific, accurate statement is better than an impressive invented one.",
        simple:
          "Say what you did and what it helped achieve. Only use true numbers.",
        example:
          "“Organized weekly equipment checks and kept maintenance records current.”",
        question: "When should you add a number to a résumé?",
        choices: [
          "Whenever it sounds impressive",
          "When it is accurate and you can support it",
          "In every sentence",
        ],
        answer: 1,
      },
    ],
    checklist: [
      "Choose a responsibility you can discuss publicly.",
      "Use plain language instead of unfamiliar abbreviations.",
      "Connect your actual skills to the job.",
      "Describe an action and a truthful result.",
    ],
  },
  {
    id: "application",
    path: "career",
    title: "Practice a job application",
    short: "Get comfortable with applications",
    description: "Work through a sample form and review it before submitting.",
    minutes: 6,
    icon: "file",
    skill: "Job applications",
    steps: [
      {
        title: "Read before you fill",
        text: "Check the employer, role, location, and requirements before entering information. Use an official hiring page reached from the organization’s known website.",
        simple:
          "Check that the job and website are real before sharing information.",
        example:
          "Find the employer’s Careers page yourself and look for the same job there.",
        question: "Where is a safer place to begin an application?",
        choices: [
          "An unknown text-message link",
          "The employer’s verified careers page",
          "A message asking you to pay first",
        ],
        answer: 1,
      },
      {
        title: "Prepare the basics",
        text: "Have your contact information, work history, and résumé ready. Required fields are usually marked. Use an email address you check. Our practice form uses sample information only.",
        simple:
          "Have your contact details and résumé ready. Read each field label.",
        example:
          "A field labeled “Email” needs an email address, not a home mailing address.",
        question: "What helps you fill an application accurately?",
        choices: [
          "Guessing missing dates",
          "Skipping all labels",
          "Preparing your information and reading each field",
        ],
        answer: 2,
      },
      {
        title: "Review before submitting",
        text: "Check spelling, contact details, and attachments. Review any consent statement before agreeing. Keep a copy or confirmation of your submission for your records.",
        simple:
          "Check the form and résumé. Read any agreement. Save the confirmation.",
        example:
          "If your email is misspelled, the employer may not be able to contact you.",
        question: "What should you do before submitting?",
        choices: [
          "Review all details and any consent statement",
          "Click every checkbox without reading",
          "Close the page without saving",
        ],
        answer: 0,
      },
    ],
    checklist: [
      "Verify the employer and application website.",
      "Prepare accurate contact details and work history.",
      "Attach the right résumé.",
      "Review consent and save the confirmation.",
    ],
  },
  {
    id: "interview",
    path: "career",
    title: "Prepare an interview answer",
    short: "Tell the story of your skills",
    description:
      "Practice a clear answer using a situation, action, and result.",
    minutes: 8,
    icon: "chat",
    skill: "Interview preparation",
    steps: [
      {
        title: "Choose one real example",
        text: "For a question like “Tell me about a time you solved a problem,” choose one specific situation you can discuss publicly. Explain the context in a sentence or two.",
        simple: "Choose one true example. Explain the problem briefly.",
        example:
          "“Our team needed a clearer way to track equipment maintenance.”",
        question: "Which example is most useful in an interview?",
        choices: [
          "A specific, true situation you can discuss",
          "A made-up story",
          "A list of unexplained acronyms",
        ],
        answer: 0,
      },
      {
        title: "Explain your contribution",
        text: "Say what you personally did while recognizing others’ contributions. Explain the action in plain language so someone outside the military can follow it.",
        simple: "Describe your own action. Give your team credit too.",
        example:
          "“I created a shared checklist and asked teammates to record completed checks.”",
        question: "What should the action part explain?",
        choices: [
          "Only what the whole organization did",
          "Your contribution, in clear language",
          "Unrelated background details",
        ],
        answer: 1,
      },
      {
        title: "Finish with the outcome",
        text: "Describe the result and what you learned. Avoid invented numbers. Practice aloud if you want, then adjust the answer so it sounds natural to you.",
        simple: "Say what happened and what you learned. Keep it honest.",
        example:
          "“The checklist made missed checks easier to spot. I learned to make instructions simple.”",
        question: "What makes a strong ending?",
        choices: [
          "An exaggerated result",
          "A new unrelated story",
          "An honest outcome and what you learned",
        ],
        answer: 2,
      },
    ],
    checklist: [
      "Choose a relevant example you can share.",
      "Explain the situation briefly.",
      "Describe your action and recognize the team.",
      "Finish with a truthful outcome and lesson.",
    ],
  },
];
export const paths = {
  digital: {
    title: "Everyday technology",
    description: "Feel more at home in a digital world.",
    icon: "monitor",
  },
  career: {
    title: "Your next career",
    description: "Bring your experience to what comes next.",
    icon: "briefcase",
  },
};
export const defaults = {
  name: "",
  size: "standard",
  contrast: false,
  focus: false,
  motion: true,
  short: false,
  sound: false,
  experience: false,
  rate: "1",
  goal: "either",
};
export function progressFor(state, id) {
  return (
    state.progress?.[id] || {
      step: 0,
      answers: {},
      practice: false,
      complete: false,
    }
  );
}
export function stats(state) {
  return {
    completed: lessons.filter((l) => progressFor(state, l.id).complete).length,
    started: lessons.filter((l) => state.progress?.[l.id]).length,
    saved: (state.saved || []).length,
  };
}
export function emailValid(d) {
  return (
    d.to?.trim().toLowerCase() === "careers@example.com" && // taste-skill-ignore: reserved domain required by safe practice exercise
    !!d.subject?.trim() &&
    !!d.message?.trim() &&
    d.attached === true
  );
} // taste-skill-ignore: reserved example domains are intentional teaching content
export function applicationValid(d) {
  return (
    !!d.name?.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || "") &&
    d.attached === true &&
    d.consent === true
  );
}
