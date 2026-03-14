/**
 * Seed sample notes (DSA, OS, DBMS, CN) into Materials table.
 * Run: node scripts/seedSampleNotes.js
 */
require("dotenv").config();
const { sequelize } = require("../config/db");
const { Subject, Material, User } = require("../models");

const SAMPLE_SUBJECTS = [
  { name: "DSA", slug: "dsa", description: "Data Structures and Algorithms" },
  { name: "Operating System", slug: "os", description: "Operating System concepts" },
  { name: "DBMS", slug: "dbms", description: "Database Management System" },
  { name: "Computer Networks", slug: "cn", description: "Computer Networks" },
];

const SAMPLE_MATERIALS = [
  {
    subjectSlug: "dsa",
    title: "Arrays and Strings",
    description: "## Arrays\n- Linear data structure\n- Contiguous memory\n- Index-based access\n\n## Strings\n- Character arrays\n- Common operations: length, substring, compare",
    content: "Arrays store elements in contiguous memory. Strings are character arrays. Key operations: traversal, search, sort.",
  },
  {
    subjectSlug: "dsa",
    title: "Linked Lists",
    description: "## Singly Linked List\n- Node: data + next pointer\n- Insertion: O(1) at head\n- Deletion: O(n) worst case\n\n## Doubly Linked List\n- prev and next pointers",
    content: "Linked list nodes contain data and pointer to next. Doubly linked has prev and next.",
  },
  {
    subjectSlug: "dsa",
    title: "Stacks and Queues",
    description: "## Stack\n- LIFO\n- push, pop, peek\n- Use: recursion, expression parsing\n\n## Queue\n- FIFO\n- enqueue, dequeue",
    content: "Stack: LIFO. Queue: FIFO. Applications: recursion (stack), BFS (queue).",
  },
  {
    subjectSlug: "os",
    title: "Process and Threads",
    description: "## Process\n- Program in execution\n- Has PCB, memory space\n\n## Threads\n- Lightweight process\n- Share address space\n- Context switch faster",
    content: "Process = program + resources. Thread = unit of execution within process. Threads share memory.",
  },
  {
    subjectSlug: "os",
    title: "Scheduling",
    description: "## CPU Scheduling\n- FCFS, SJF, Round Robin\n- Preemptive vs Non-preemptive\n- Priority scheduling",
    content: "Scheduling algorithms: FCFS, SJF, Round Robin. Preemptive allows interruption.",
  },
  {
    subjectSlug: "dbms",
    title: "Normalization",
    description: "## Normal Forms\n- 1NF: Atomic values\n- 2NF: No partial dependency\n- 3NF: No transitive dependency\n- BCNF: Every determinant is candidate key",
    content: "1NF, 2NF, 3NF, BCNF reduce redundancy. Each normal form adds constraints.",
  },
  {
    subjectSlug: "dbms",
    title: "ACID Properties",
    description: "## ACID\n- **Atomicity**: All or nothing\n- **Consistency**: Valid state\n- **Isolation**: Concurrent transactions\n- **Durability**: Committed data persists",
    content: "ACID ensures reliable transactions. Atomicity = all or nothing. Isolation = concurrent safety.",
  },
  {
    subjectSlug: "cn",
    title: "OSI Model",
    description: "## 7 Layers\n1. Physical\n2. Data Link\n3. Network\n4. Transport\n5. Session\n6. Presentation\n7. Application",
    content: "OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
  },
  {
    subjectSlug: "cn",
    title: "TCP vs UDP",
    description: "## TCP\n- Connection-oriented\n- Reliable, ordered\n- Flow control, congestion control\n\n## UDP\n- Connectionless\n- No guarantee\n- Lower overhead",
    content: "TCP: reliable, ordered. UDP: fast, no guarantee. Use TCP for files, UDP for streaming.",
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    let admin = await User.findOne({ where: { role: "admin" } });
    if (!admin) {
      admin = await User.findOne({ where: { role: "faculty" } });
    }
    if (!admin) {
      admin = await User.findOne();
    }
    if (!admin) {
      console.log("Create a user first (register), then run this script.");
      process.exit(1);
    }

    for (const s of SAMPLE_SUBJECTS) {
      const [sub] = await Subject.findOrCreate({ where: { slug: s.slug }, defaults: s });
      console.log("Subject:", sub.name);
    }

    for (const m of SAMPLE_MATERIALS) {
      const sub = await Subject.findOne({ where: { slug: m.subjectSlug } });
      if (!sub) continue;
      const [mat] = await Material.findOrCreate({
        where: { subjectId: sub.id, title: m.title },
        defaults: {
          subjectId: sub.id,
          title: m.title,
          description: m.description,
          fileUrl: "/sample",
          fileType: "other",
          uploadedById: admin.id,
        },
      });
      console.log("Material:", mat.title);
    }
    console.log("Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
