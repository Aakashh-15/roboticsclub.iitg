/* =====================================================================
   ROBOTICS CLUB IIT GUWAHATI — SITE CONTENT
   ---------------------------------------------------------------------
   Everything shown on the website comes from this file.
   Edit text here; no HTML changes needed.

   Content marked  sample: true  is a PLACEHOLDER — replace or delete it.
   Everything else was taken from the previous club website
   (iitg.ac.in/sa/roboclub) or supplied by the core team.

   Images: currently loaded from the old site (OLD). To self-host, copy
   files into /images and change e.g.  image: "images/yuvaan.jpg".
   ===================================================================== */

const OLD = "https://www.iitg.ac.in/sa/roboclub/img/";

window.CLUB = {
  name: "Robotics Club",
  institute: "IIT Guwahati",
  tagline:
    "The robotics community of IIT Guwahati — uniting students to design, build and compete with machines across mechanical, electronic and software design.",

  about: {
    heading: "We build robots that think, move and compete.",
    body: [
      "The Robotics Club of IIT Guwahati unites students in an educational environment where they can pursue their interest in mechanical, electronic and software design by building real robots — from autonomous bots and humanoids to swarm robotics, robotic arms and aerial vehicles.",
      "Experience is not a prerequisite. As our members like to say, none of us had any idea of robotics when we first stepped into the club room. Freshers learn through workshops and mentored projects, showcase their work at Techevince, and represent IIT Guwahati at the Inter IIT Tech Meet.",
    ],
    pillars: [
      "Autonomous bots",
      "Humanoids",
      "Swarm robotics",
      "Robotic arms",
      "Aerial vehicles",
      "Open to every branch",
    ],
  },

  // Stats are computed automatically where possible (see main.js);
  // "value" here overrides the computed number.
  stats: [
    { key: "projects", suffix: "+", label: "Projects built" },
    { key: "podiums", label: "Inter IIT podiums" },
    { key: "events", label: "Flagship events" },
    { key: "team", label: "Core team members" },
  ],

  /* ---------- PROJECTS ----------
     group    → filter chip + section on the page
     status   → badge
     image    → photo; if it fails to load, the icon is shown instead  */
  projects: [
    // ---- Flagship ----
    { id: "yuvaan", title: "Yuvaan", subtitle: "Mars rover programme", group: "Flagship", status: "Active", icon: "rover", color: "purple",
      image: OLD + "projects/Yuvaan.jpg", lead: "Tirth Patel",
      summary: "Ever wondered what goes inside the core of a hyped space expedition programme? Yuvaan is the club's Mars-rover team.",
      overview: "Yuvaan explores what it takes to land on another planet and operate there — through the design and development of a planetary rover. The team works across chassis and suspension, power, communication, manipulation and autonomy." },

    // ---- Academic year 2021 ----
    { id: "ar-glasses", title: "Artificial-reality Glasses", group: "2021", status: "Ongoing", icon: "bulb", color: "pink",
      image: OLD + "projects/21. ar_glasses.png", mentors: ["Devesh Gupta"],
      summary: "A pair of glasses that does more than just correct your vision." },
    { id: "drivezee", title: "Drivezee", group: "2021", status: "Ongoing", icon: "rover", color: "yellow",
      image: OLD + "projects/21. drivezee.jpeg", mentors: ["Yash Joshi"],
      summary: "A small-scale bot driven by an IC engine.",
      overview: "Drivezee is built in two phases. Phase one focuses on the design of an RC-operated, engine-powered car. Phase two addresses the transmission and transfer of power to the wheels." },
    { id: "exoskeleton", title: "Exoskeleton", group: "2021", status: "Ongoing", icon: "arm", color: "purple",
      image: OLD + "projects/21. exoskeleton.jpg", mentors: ["Saranyaa Thiagarajan"],
      summary: "A shoulder-assistive wearable exoskeleton.",
      overview: "An exoskeleton is a wearable electromechanical structure intended to resemble, and allow movement similar to, the human skeletal system. This project builds a shoulder-assistive exoskeleton." },
    { id: "fido", title: "FiDo", group: "2021", status: "Ongoing", icon: "bot", color: "pink",
      image: OLD + "projects/21. fido.png", mentors: ["Sree Rakhi Kudipudi"],
      summary: "An all-terrain, joystick-controlled bot that can roll on any surface.",
      overview: "Thanks to its wheel-like shape, FiDo can roll over any surface and go anywhere within its wireless range, controlled by a joystick. Applications include security and surveillance." },
    { id: "marjanator", title: "Marjanator", group: "2021", status: "Ongoing", icon: "swarm", color: "yellow",
      image: OLD + "projects/21. awwc.jpg", mentors: ["Nahush Bhamre"],
      summary: "An autonomous vessel that collects floating waste from water bodies." },
    { id: "pipe-bot", title: "Pipe Traversing Bot", group: "2021", status: "Ongoing", icon: "rover", color: "purple",
      image: OLD + "projects/21. pipe.png", mentors: ["Shreya Singh"],
      summary: "A bot for gas-pipeline inspection and maintenance.",
      overview: "The bot travels through pipelines to identify and report damage without manual intervention." },
    { id: "robotic-arm-2021", title: "Robotic Arm", group: "2021", status: "Ongoing", icon: "arm", color: "pink",
      image: OLD + "projects/21. rob_arm.jpg", mentors: ["Ritesh Ranjan", "Sanjana Reddy Kalsani"],
      summary: "A 6-DOF robotic arm that can fold into a small space.",
      overview: "A robotic arm with six degrees of freedom and the ability to fold into a compact space, targeting industrial automation and medical applications." },
    { id: "talking-bot", title: "Talking Bot", group: "2021", status: "Ongoing", icon: "bot", color: "yellow",
      image: OLD + "projects/21. talk.jpeg", mentors: ["Rahul Aggarwal"],
      summary: "A voice-recognition chatbot built with sequence models and NLP, inspired by Alexa and Siri." },
    { id: "wall-plotter", title: "Wall Plotter", group: "2021", status: "Ongoing", icon: "arm", color: "purple",
      image: OLD + "projects/21. wall_plotter.jpeg", mentors: ["Varshith Kancharla"],
      summary: "Give it an image and it controls a pen to draw it on a wall, automatically." },

    // ---- Inter IIT ----
    { id: "agrobot", title: "RuTag's Agrobot", group: "Inter IIT", event: "Inter IIT Tech Meet 9.0", status: "1st Position", icon: "rover", color: "yellow",
      image: OLD + "projects/20. agrobot.png",
      summary: "The agricultural robot that won first place at Inter IIT Tech Meet 9.0.",
      overview: "The Agrobot uses a rocker-bogie mechanism to navigate farm terrain. A vacuum pump picks up seeds, a tree-spade system handles transplanting, and a camera identifies weeds." },
    { id: "terrace-farming", title: "DIC's Terrace Farming Robot", group: "Inter IIT", event: "Inter IIT Tech Meet 8.0", status: "2nd Position", icon: "rover", color: "pink",
      image: OLD + "projects/19. dic.jpeg",
      summary: "A lightweight autonomous farming bot that climbs terrace steps. Second place at Inter IIT Tech Meet 8.0.",
      overview: "The robot climbs steep terrace steps and navigates reliably across uneven terrain to plough, seed, water and harvest." },
    { id: "soldier-support", title: "Technology for Soldier Support", group: "Inter IIT", event: "Inter IIT Tech Meet 7.0", status: "Inter IIT", icon: "chip", color: "purple",
      image: OLD + "projects/18. soldier.png",
      summary: "A wearable suit with sensors for motion detection and real-time tracking.",
      overview: "After a training period, the suit detects the wearer's motion and transmits real-time tracking information to a base station." },
    { id: "fishing-safety", title: "Safety Devices for Fishing Vessels", group: "Inter IIT", event: "Inter IIT Tech Meet 7.0", status: "Inter IIT", icon: "chip", color: "yellow",
      image: OLD + "projects/18. fishing.png",
      summary: "Ship-proximity alerts for fishing vessels using AIS signals and solar-powered buoys.",
      overview: "Ship distance is estimated from AIS signal power, a directional antenna estimates the direction of approach, and alerts are relayed over RF through a network of solar-powered buoys." },

    // ---- Techevince 7.0 ----
    { id: "biped", title: "Biped", group: "Techevince", event: "Techevince 7.0", status: "Completed", icon: "bot", color: "purple",
      image: OLD + "projects/biped.jpg",
      summary: "A 10-DOF two-legged robot that walks on flat surfaces." },
    { id: "planar-manipulator", title: "Planar Manipulator", group: "Techevince", event: "Techevince 7.0", status: "Completed", icon: "arm", color: "pink",
      image: OLD + "projects/20. planar_man.png",
      summary: "A planar arm modelled on the human hand, capable of pattern-based writing, path traversal and object manipulation." },
    { id: "replication-bot", title: "Replication Bot", group: "Techevince", event: "Techevince 7.0", status: "Completed", icon: "arm", color: "yellow",
      image: OLD + "projects/20. replication_bot.jpg",
      summary: "A microcontroller-based arm that mirrors the motion of a synchronised replica." },
    { id: "drawing-machine", title: "Robotic Drawing Machine", group: "Techevince", event: "Techevince 7.0", status: "Completed", icon: "arm", color: "purple",
      image: OLD + "projects/20. drawing-arm.png",
      summary: "A two-axis pen-drawing machine for those short on drawing skill or time." },
    { id: "shape-shifter", title: "Shape Shifter", group: "Techevince", event: "Techevince 7.0", status: "Completed", icon: "gear", color: "pink",
      image: OLD + "projects/20. shapeshift.png",
      summary: "A terrain-adaptive wheel inspired by DARPA's shape-shifting wheel for all-terrain vehicles." },
    { id: "wall-follower", title: "Wall Follower", group: "Techevince", event: "Techevince 7.0", status: "Completed", icon: "bot", color: "yellow",
      image: OLD + "projects/20. wall_follow.png",
      summary: "An Arduino robot that follows a wall while holding a fixed distance from it." },
    { id: "warehouse", title: "Warehouse Management", group: "Techevince", event: "Techevince 7.0", status: "Completed", icon: "rover", color: "purple",
      image: OLD + "projects/20. warehouse.jpg",
      summary: "A fully autonomous bot that avoids obstacles to locate, lift and transport inventory." },

    // ---- Techevince 6.0 ----
    { id: "augmata", title: "Augmata", group: "Techevince", event: "Techevince 6.0", status: "Completed", icon: "bulb", color: "pink",
      image: OLD + "projects/19. augmata.png",
      summary: "Augmented reality that enhances the real world with sounds, images and interactive virtual objects." },
    { id: "ballet-of-bots", title: "Ballet of Bots", group: "Techevince", event: "Techevince 6.0", status: "Completed", icon: "gear", color: "yellow",
      image: OLD + "projects/19. ballet_of_bot.png",
      summary: "PID control of a weighted ball on a flat surface, moving it precisely to set-points." },
    { id: "cyrus", title: "Cyrus", group: "Techevince", event: "Techevince 6.0", status: "Completed", icon: "rover", color: "purple",
      image: OLD + "projects/19. cyrus.jpg",
      summary: "A vehicle that tracks a sound source and drives autonomously towards it, using low-cost sensors and voice recognition." },
    { id: "lazy-fill", title: "Lazy Fill", group: "Techevince", event: "Techevince 6.0", status: "Completed", icon: "gear", color: "pink",
      image: OLD + "projects/19. lazy_fill.jpg",
      summary: "Automated water-bottle filling that removes the manual steps." },
    { id: "rearranging-arm", title: "Rearranging Robotic Arm", group: "Techevince", event: "Techevince 6.0", status: "Completed", icon: "arm", color: "yellow",
      image: OLD + "projects/19. rearrange_robotic_arm.png",
      summary: "A 4R arm with vision and control for sorting, rearranging, obstacle avoidance and trajectory planning." },
    { id: "rubiks-2019", title: "Rubik's Cube Solver", group: "Techevince", event: "Techevince 6.0", status: "Completed", icon: "chip", color: "purple",
      image: OLD + "projects/19. rubiks.jpeg",
      summary: "Scans a cube and solves it with stepper motors on an acrylic, pillar-mounted frame." },
    { id: "stair-climber", title: "Stair Climbing Robot", group: "Techevince", event: "Techevince 6.0", status: "Completed", icon: "rover", color: "pink",
      image: OLD + "projects/19. stair_climber.jpg",
      summary: "A six-wheeled NodeMCU bot with a self-adjusting gimbal plate that climbs stairs.",
      overview: "The robot uses high-torque DC motors, a self-adjusting gimbal plate, a flexible front elbow joint and rigid rear arms to climb stairs, all controlled through a NodeMCU." },

    // ---- Techevince 5.0 ----
    { id: "atv", title: "All Terrain Vehicle", group: "Techevince", event: "Techevince 5.0", status: "Completed", icon: "rover", color: "yellow",
      image: OLD + "projects/18. all_ter.png",
      summary: "A rocker-bogie vehicle, the Mars-rover mechanism for crossing rough terrain while staying stable." },
    { id: "attendance-bot", title: "Attendance Taking Bot", group: "Techevince", event: "Techevince 5.0", status: "Completed", icon: "bot", color: "purple",
      image: OLD + "projects/18. attendance.png",
      summary: "Automated attendance recording using face recognition." },
    { id: "cycle-lock", title: "Cycle Lock", group: "Techevince", event: "Techevince 5.0", status: "Completed", icon: "chip", color: "pink",
      image: OLD + "projects/18. cycle_lock.png",
      summary: "A Bluetooth lock that turns the key with a servo, driven by an Arduino Micro." },

    // ---- Techevince 4.0 ----
    { id: "ball-collector", title: "Automated Ball Collector", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "rover", color: "yellow",
      image: OLD + "projects/17. abc.png",
      summary: "The true tennis buddy: place it on the court and it collects the balls for you." },
    { id: "biped-ros", title: "Bi-pedal Robot", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "bot", color: "purple",
      image: OLD + "projects/17. biped.png",
      summary: "A ROS-controlled biped robot driven by a joystick." },
    { id: "ball-arm", title: "The Robotic Arm", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "arm", color: "pink",
      image: OLD + "projects/17. arm.png",
      summary: "An arm that finds coloured balls in 3D space and grasps them automatically." },
    { id: "deltabot", title: "Deltabot", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "arm", color: "yellow",
      image: OLD + "projects/17. delta.png",
      summary: "A parallel delta robot whose parallelogram arms keep the end-effector's orientation fixed.",
      overview: "A delta robot has three arms connected to universal joints at the base. Its parallelogram arms keep the end-effector's orientation constant, the design used in industrial picking and packaging at up to 300 picks per minute." },
    { id: "hive", title: "Hive v2.0", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "swarm", color: "purple",
      image: OLD + "projects/17. hive.png",
      summary: "The club's first prototype of an autonomous, intelligent multi-robot swarm system, built to be expanded." },
    { id: "mobile-printer", title: "Mobile Printer", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "rover", color: "pink",
      image: OLD + "projects/17. mobile.png",
      summary: "A mobile robot that writes letters and words by driving around." },
    { id: "rubiks-2017", title: "Rubik's Cube Solver (v1)", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "chip", color: "yellow",
      image: OLD + "projects/17. rubik.png",
      summary: "Image processing detects the scrambled state, computes a solution and drives grippers to execute it." },
    { id: "transformer", title: "Transformer", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "bot", color: "purple",
      image: OLD + "projects/17. transform.png",
      summary: "A modular robot in the spirit of the Transformers films, part of an evolving robot ecosystem." },
    { id: "vein-finder", title: "Vein Finder", group: "Techevince", event: "Techevince 4.0", status: "Completed", icon: "bulb", color: "pink",
      image: OLD + "projects/17. vein.png",
      summary: "Near-infrared LEDs and a filtered camera make veins visible beneath the skin.",
      overview: "A U-shaped arrangement of LEDs projects near-infrared light. Blood absorbs it while tissue reflects it, so veins stand out when viewed through an infrared-filtered camera." },
  ],

  /* ---------- IMPORTANT NOTICES (moving news bar on the home page) ----------
     Short one-line messages shown first in the bar, before announcements.
     link is optional (defaults to the Updates page). Remove when outdated. */
  notices: [
    // { text: "ROBO101 registrations close on 10 October", tag: "Important", link: "updates.html" },
  ],

  announcements: [
    {
      date: "2026-09-26",
      type: "Recruitment",
      title: "Selection Task released: The Clue Chain Hunt",
      body: "Our freshers' selection task is live. Program a robot in ROS 2 to follow a chain of clues through a simulated arena. Download the problem statement and set up your environment with our installation guides.",
      links: [
        ["Problem statement", "materials/selection-task-clue-chain-hunt.pdf"],
        ["Install guide · Humble", "materials/ros2-humble-install-guide.pdf"],
        ["Install guide · Jazzy", "materials/ros2-jazzy-install-guide.pdf"],
      ],
      pinned: true,
      timeline: true, // also show on the Recent & upcoming timeline
    },
    { date: "2026-09-20", type: "Workshop", title: "ROS 2 bootcamp for freshers", sample: true,
      body: "A hands-on session on nodes, topics, launch files and Gazebo simulation. Bring a laptop with Ubuntu and ROS 2 installed." },
    { date: "2026-08-28", type: "Competition", title: "Inter IIT Tech Meet: register your interest", sample: true,
      body: "Want to represent IIT Guwahati? Reach out to the Competition Manager to join the prep teams." },
  ],

  /* ---------- RECENT & UPCOMING TIMELINE ----------
     Dated events. Future dates show as "Upcoming", current ones as
     "Live now", past ones as "Recent". Announcements with timeline: true
     appear here too. end is optional (one-day events). image = poster.
     time / venue are optional and shown on the card. */
  timeline: [
    {
      start: "2026-06-29", end: "2026-07-05",
      title: "Minecraft Championship",
      subtitle: "The Engineer's Gauntlet",
      type: "Competition",
      host: "Funniche Week '26 × Robotics Club, IIT Guwahati",
      desc: "A week-long Minecraft championship, The Engineer's Gauntlet, held as part of Funniche Week '26.",
      highlights: ["Prize pool worth 20K", "29 June – 5 July 2026"],
      image: "images/events/minecraft-championship-2026.webp",
    },
    {
      start: "2026-06-01",
      title: "ROBO101 course launch",
      type: "Course",
      host: "Robotics Club, IIT Guwahati",
      desc: "The 2026 edition of ROBO101, the club's robotics course, went live on 1 June 2026.",
      highlights: ["ROS 2", "TensorFlow", "Fusion 360", "ANSYS", "Electronics"],
    },
    {
      start: "2026-09-04",
      title: "Freshers' Orientation",
      type: "Orientation",
      time: "7:30 PM",
      venue: "Core 5",
      host: "Robotics Club, IIT Guwahati",
      desc: "The club's introductory session for the incoming batch: who we are, what we build, and how freshers can get involved.",
      image: "images/events/freshers-orientation-2026.webp",
    },
  ],

  /* ---------- FLAGSHIP EVENTS ----------
     The club's recurring signature events (no dates). */
  events: [
    { title: "Freshers' Orientation", desc: "The start-of-year introduction for the new batch: what the club does and how to get started.", image: OLD + "orientation.jpg" },
    { title: "ROBO101", desc: "The club's robotics course: ROS 2, TensorFlow, Fusion 360, ANSYS and electronics.", icon: "chip" },
    // ↑ add  image: "images/events/robo101.webp"  once the poster is in the repo
    { title: "Arduino Workshop", desc: "Microcontrollers, sensors and motors: your first working circuit.", image: OLD + "arduino_workshop.jpg" },
    { title: "OpenCV Workshop", desc: "Computer vision fundamentals for robots that see.", image: OLD + "opencv_workshop.jpg" },
    { title: "AI Workshop", desc: "Machine learning concepts applied to robotics.", image: OLD + "ai_workshop.jpg" },
    { title: "10 Hours Robot Challenge", desc: "Design, build and program a robot against the clock.", image: OLD + "10_hr_chalenge.jpg" },
    { title: "Robothon", desc: "The club's robotics hackathon.", image: OLD + "Robothon.JPG" },
  ],

  competitions: [
    { name: "Inter IIT Tech Meet", scope: "National", desc: "The flagship technical contest between all IITs. Our teams took 1st at 9.0 and 2nd at 8.0." },
    { name: "Techevince", scope: "Institute", desc: "IIT Guwahati's technical exhibition, where club projects are showcased every year." },
    { name: "Techniche", scope: "Institute", desc: "IIT Guwahati's techno-management festival and its robotics events.", sample: true },
    { name: "International Rover Challenge", scope: "International", desc: "Mars-analog rover competition. Team Yuvaan finished 17th of 36 teams at IRC 2023." },
    { name: "University Rover Challenge", scope: "International", desc: "The world's premier collegiate rover competition, held in Utah.", sample: true },
    { name: "DD Robocon India", scope: "National", desc: "India's qualifier for ABU Robocon, with a new robotics game every year.", sample: true },
  ],

  /* ---------- ACHIEVEMENTS ----------
     rank  → short label shown in the list ("1st", "2nd", "17th", …);
             1st/2nd/3rd get gold/silver/bronze medals automatically.
     Newest first. Add recent results at the top. */
  achievements: [
    { year: "2023", rank: "17th", title: "17th of 36 teams", event: "International Rover Challenge 2023",
      desc: "Team Yuvaan took the club's Mars rover to the international stage in Bengaluru, finishing 17th among 36 university teams from across the world.",
      project: "yuvaan", image: OLD + "projects/Yuvaan.jpg" },
    { year: "2020", rank: "1st", title: "1st Position", event: "Inter IIT Tech Meet 9.0",
      desc: "RuTag's Agrobot: rocker-bogie farm robot with seed pickup, transplanting and camera-based weed detection.",
      project: "agrobot", image: OLD + "2020.jpg" },
    { year: "2019", rank: "2nd", title: "2nd Position", event: "Inter IIT Tech Meet 8.0",
      desc: "DIC's Terrace Farming Robot: autonomous bot that climbs terrace steps to plough, seed, water and harvest.",
      project: "terrace-farming", image: OLD + "2019.jpg" },
    { year: "2018", rank: "2 entries", title: "IIT Guwahati contingent", event: "Inter IIT Tech Meet 7.0",
      desc: "Two problem statements tackled: Technology for Soldier Support and Safety Devices for Fishing Vessels.",
      project: "soldier-support", image: OLD + "2018.JPG" },
    { year: "2017–20", rank: "26 builds", title: "26 projects exhibited", event: "Techevince 4.0 – 7.0",
      desc: "Four editions of IIT Guwahati's tech exhibition, featuring bipeds, delta robots, swarm bots, Rubik's cube solvers and more.",
      image: OLD + "projects/20. warehouse.jpg", link: "projects.html" },
  ],

  /* ---------- TEAM ----------
     Photos are picked up automatically from images/team/<name>.jpg.
     Fill in linkedin (full https URL) for the button on each person's
     contact card. Optional: department, year, about (one line),
     image (custom photo path). */
  team: [
    { name: "B Gautam Rao", role: "Secretary", linkedin: "" },
    { name: "Akshat Agarwal", role: "Overall Coordinator", linkedin: "" },
    { name: "Tirth Patel", role: "Yuvaan Lead", linkedin: "" },
    { name: "Siddharth Gupta", role: "Project Manager", linkedin: "" },
    { name: "Ananya Dongsarwar", role: "Project Manager", linkedin: "" },
    { name: "Nidhi Maria Santosh", role: "Competition Manager", linkedin: "" },
    { name: "Aakash Kumar Meena", role: "Events Head", linkedin: "https://www.linkedin.com/in/aakash-kumar-meena-a06733314/" },
    { name: "Arya Kshirsagar", role: "Events Head", linkedin: "" },
    { name: "Sukant Agrawal", role: "Growth and Outreach", linkedin: "" },
    { name: "Jai Mishra", role: "Growth and Outreach", linkedin: "" },
    { name: "Ishan Boral", role: "Inventory Head", linkedin: "" },
  ],

  // Gallery = event photos + extra shots. Add { image, caption, tag } freely.
  // The first 5 appear on the home page, so keep light, striking photos at the top.
  gallery: [
    { image: OLD + "walle_hi.jpg", caption: "Say hi to the club", tag: "Club" },
    { image: OLD + "2020.jpg", caption: "Inter IIT Tech Meet 9.0", tag: "Competition" },
    { image: OLD + "2019.jpg", caption: "Inter IIT Tech Meet 8.0", tag: "Competition" },
    { image: OLD + "orientation.jpg", caption: "Introductory session", tag: "Events" },
    { image: OLD + "arduino_workshop.jpg", caption: "Arduino workshop", tag: "Workshop" },
    { image: OLD + "opencv_workshop.jpg", caption: "OpenCV workshop", tag: "Workshop" },
    { image: OLD + "ai_workshop.jpg", caption: "AI workshop", tag: "Workshop" },
    { image: OLD + "10_hr_chalenge.jpg", caption: "10 Hours Robot Challenge", tag: "Events" },
    { image: OLD + "Robothon.JPG", caption: "Robothon", tag: "Events" },
    { image: OLD + "2018.JPG", caption: "Inter IIT Tech Meet 7.0", tag: "Competition" },
  ],

  resources: [
    {
      tab: "Getting started",
      items: [
        { title: "Ubuntu 22.04 + ROS 2 Humble setup", desc: "Club installation guide.", url: "materials/ros2-humble-install-guide.pdf", kind: "PDF" },
        { title: "Ubuntu 24.04 + ROS 2 Jazzy setup", desc: "Club installation guide.", url: "materials/ros2-jazzy-install-guide.pdf", kind: "PDF" },
        { title: "Selection Task: The Clue Chain Hunt", desc: "Freshers' selection problem statement.", url: "materials/selection-task-clue-chain-hunt.pdf", kind: "PDF" },
        { title: "ROS 2 Humble documentation", desc: "Official tutorials: nodes, topics, services, launch files.", url: "https://docs.ros.org/en/humble/", kind: "Docs" },
        { title: "ROS 2 Jazzy documentation", desc: "Docs for the latest LTS release.", url: "https://docs.ros.org/en/jazzy/", kind: "Docs" },
        { title: "Gazebo simulator", desc: "Robot simulation tutorials and API.", url: "https://gazebosim.org/docs", kind: "Docs" },
      ],
    },
    {
      tab: "Club archive",
      items: [
        { title: "Arduino", desc: "Open-source electronic prototyping platform for building interactive objects.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuLXJWODJaQUZidjg", kind: "Drive" },
        { title: "Induino", desc: "Simple Labs' prototyping board built on the Arduino framework.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuTFdGRmNaYTFBTEU", kind: "Drive" },
        { title: "PID Line Following", desc: "Proportional, integral and derivative control for smoother robot motion.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuT3FnVDhIbXN2OTg", kind: "Drive" },
        { title: "Datasheets", desc: "Specifications and performance data for common components.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuRHpOUTJVOXA3U0E", kind: "Drive" },
        { title: "GPS", desc: "Satellite navigation: receivers and algorithms for location, velocity and time.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuUVhOVjZTWWJPMk0", kind: "Drive" },
        { title: "Image Processing", desc: "Enhance images and extract useful information from visual data.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuX05kWkFNd2xzLUE", kind: "Drive" },
        { title: "Control Systems", desc: "Monitoring and managing the behaviour of machines and processes.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuaU4yUlJsbHNZa1E", kind: "Drive" },
        { title: "Voice Recognition", desc: "Identifying and authenticating individual speakers.", url: "https://drive.google.com/drive/u/0/folders/0B32MLT2oE3VuZTRaSGxLRUg5OFU", kind: "Drive" },
        { title: "CAD", desc: "2D drawings and 3D models of robot parts.", url: "https://drive.google.com/drive/folders/1TbcODJbZZ2YfUsC8Yg04ioVb9QXqbyen", kind: "Drive" },
        { title: "Unity", desc: "Custom simulations and robot design environments.", url: "https://drive.google.com/drive/folders/1DvcLHC8-vApKrBOiyb5cz1mRwPoDIiKM", kind: "Drive" },
      ],
    },
    {
      tab: "Electronics",
      items: [
        { title: "Arduino documentation", desc: "Boards, libraries and getting-started guides.", url: "https://docs.arduino.cc/", kind: "Docs" },
        { title: "SparkFun tutorials", desc: "Sensors, motors, soldering and communication protocols.", url: "https://learn.sparkfun.com/tutorials", kind: "Tutorials" },
        { title: "KiCad documentation", desc: "Design your own PCBs.", url: "https://docs.kicad.org/", kind: "Docs" },
        { title: "OpenCV tutorials", desc: "Computer vision from the basics to calibration.", url: "https://docs.opencv.org/4.x/d9/df8/tutorial_root.html", kind: "Docs" },
      ],
    },
    {
      tab: "Mechanical",
      items: [
        { title: "Onshape Learning Center", desc: "Free browser-based CAD courses.", url: "https://learn.onshape.com/", kind: "Course" },
        { title: "Modern Robotics (Lynch & Park)", desc: "Free textbook and lectures on kinematics, dynamics and control.", url: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics", kind: "Book" },
        { title: "MoveIt 2", desc: "Motion planning for robotic arms.", url: "https://moveit.picknik.ai/", kind: "Docs" },
      ],
    },
    {
      tab: "Inventory",
      inventory: true, // sample list — Inventory Head to replace with the real stock
      items: [
        { title: "Arduino Uno / Nano", desc: "Microcontroller boards", qty: "Available", sample: true },
        { title: "ESP32 DevKit", desc: "Wi-Fi + BLE microcontroller", qty: "Available", sample: true },
        { title: "Raspberry Pi", desc: "Single-board computer", qty: "Limited", sample: true },
        { title: "Motor drivers (L298N / TB6612)", desc: "DC motor drivers", qty: "Available", sample: true },
        { title: "Servo motors", desc: "SG90 / MG996R", qty: "Available", sample: true },
        { title: "Ultrasonic & IR sensors", desc: "Distance and line sensing", qty: "Available", sample: true },
        { title: "IMU (MPU-6050)", desc: "Accelerometer + gyroscope", qty: "Limited", sample: true },
        { title: "LiPo batteries & chargers", desc: "Issued with a safety briefing", qty: "On request", sample: true },
      ],
    },
  ],

  contact: {
    email: "roboclub@iitg.ac.in",
    address: "Robotics Club, Student Activity Centre, IIT Guwahati, Assam 781039",
    socials: [
      ["GitHub", "https://github.com/RCIITG"],
      ["Instagram", "https://www.instagram.com/roboclubiitg/"],
      ["LinkedIn", "https://www.linkedin.com/company/robotics-club-iitg/"],
      ["YouTube", "https://www.youtube.com/user/RCIITG"],
      ["Facebook", "https://www.facebook.com/robotics.iitg"],
    ],
  },
};
