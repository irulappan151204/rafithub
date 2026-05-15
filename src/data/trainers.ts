// Trainer data for use across the app
export interface Trainer {
    id: string;
    name: string;
    role: string;
    title: string;
    image: string;
    specializations: string[];
    experience: string;
    certifications: string[];
    bio: string;
    achievements: string[];
    gallery: string[];
    isFeatured?: boolean;
    accentColor?: string;
    social: {
        instagram?: string;
        youtube?: string;
        linkedin?: string;
        facebook?: string;
    };
    contact: {
        email: string;
        phone: string;
    };
}

export const trainers: Trainer[] = [
    {
        id: "rajith",
        name: "Dr. Ranjith",
        role: "CEO & Head Coach — RafiHub Fitness",
        title: "Mr. India Champion | Elite Performance Coach",
        image: "/trainers/1.jpg",
        isFeatured: true,
        specializations: [
            "Competitive Bodybuilding & Contest Prep",
            "Elite Strength & Conditioning",
            "CEO-Level Executive Fitness Programs",
            "Mental Toughness & Performance Psychology",
            "Nutrition Strategy for Peak Performance",
        ],
        experience: "15+ years",
        certifications: [
            "Senior Grade Certified Fitness Professional",
            "National Bodybuilding Federation",
            "Elite Performance Coach Level 5",
        ],
        bio: "Rajith is the visionary founder and CEO of RafiHub Fitness, a decorated Mr. India title holder and one of South India's most respected fitness authorities. With over 15 years of elite-level training experience, he built RafiHub from the ground up with one mission — to transform lives through disciplined training, mental toughness, and world-class coaching. His journey from competitive bodybuilding to building a fitness empire is an inspiration to thousands.",
        achievements: [
            "🏆 Mr. India Title Winner",
            "🥇 South India Bodybuilding Champion (3x)",
            "🎖️ Senior Grade Certified Fitness Professional",
            "🏋️ 15+ Years Elite Coaching Experience",
            "👥 10,000+ Members Trained",
            "📺 Featured in Fitness India Magazine",
            "🏢 Founder & CEO — RafiHub Fitness Empire",
        ],
        gallery: [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
            "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
            "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
        ],
        social: { instagram: "#", youtube: "#", linkedin: "#" },
        contact: { email: "rajith@rafithub.com", phone: "+91 98765 43210" },
    },
    {
        id: "antony",
        name: "Mr. Antony",
        role: "Senior Strength & Combat Coach",
        title: "Power Training Specialist | Combat Fitness Expert",
        image: "/trainers/2.jpg",
        specializations: [
            "Powerlifting & Strength Programming",
            "Combat Fitness & MMA Conditioning",
            "Explosive Athletic Performance",
            "Functional Movement & Mobility",
            "Body Transformation (Bulk & Cut Cycles)",
        ],
        experience: "8+ years",
        certifications: [
            "Certified Strength & Conditioning Specialist (CSCS)",
            "Combat Sports Fitness Coach",
            "Functional Training Level 3",
        ],
        bio: "Antony is RafiHub's powerhouse strength coach, known for his intense training methodology and results-driven approach. With a background in combat sports and powerlifting, Antony specializes in building raw functional strength, explosive power, and unbreakable mental resilience. His sessions are legendary at RafiHub — brutal, effective, and transformational. He has trained competitive athletes, martial artists, and everyday warriors who want to push beyond their limits.",
        achievements: [
            "🥊 State-Level Combat Sports Champion",
            "🏋️ Powerlifting Certified Coach — 8 Years Experience",
            "💪 Trained 500+ Athletes to Competition Level",
            "🎯 Specializes in 90-Day Body Transformation Programs",
            "🏅 Best Trainer Award — RafiHub 2022 & 2023",
        ],
        gallery: [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
            "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
            "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80",
        ],
        social: { instagram: "#", youtube: "#" },
        contact: { email: "antony@rafithub.com", phone: "+91 98765 43211" },
    },
    {
        id: "ganesh",
        name: "Mr. Ganesh",
        role: "Fitness Coach & Body Transformation Specialist",
        title: "Physique Expert | Natural Bodybuilding Advocate",
        image: "/trainers/3.jpg",
        specializations: [
            "Natural Bodybuilding & Physique Development",
            "Body Recomposition (Fat Loss + Muscle Gain)",
            "Hypertrophy & Muscle Building Programs",
            "Beginner to Advanced Fitness Progressions",
            "Pre-Competition Physique Peaking",
        ],
        experience: "6+ years",
        certifications: [
            "Certified Personal Trainer (CPT)",
            "Sports Nutrition Level 2",
            "Natural Bodybuilding Coach Certified",
        ],
        bio: "Ganesh is the go-to coach at RafiHub for physique transformation and natural bodybuilding. With a calm but intensely focused coaching style, Ganesh believes that every body has the potential for greatness — it just needs the right program, the right nutrition, and the right mindset. He has successfully guided hundreds of members through complete body recomposition, helping them build muscle, shed fat, and gain confidence they never thought possible.",
        achievements: [
            "🌿 Natural Bodybuilding State Finalist",
            "📊 100+ Successful Body Transformation Clients",
            "🎓 Sports Nutrition Certified Professional",
            "💯 Specializes in Zero-Steroid Natural Training Programs",
            "🏆 RafiHub Transformation Coach of the Year 2023",
        ],
        gallery: [
            "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
            "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80",
        ],
        social: { instagram: "#", facebook: "#" },
        contact: { email: "ganesh@rafithub.com", phone: "+91 98765 43212" },
    },
    {
        id: "madurakavi",
        name: "Mr. Madurakavi",
        role: "Chief Dietitian & Nutrition Coach",
        title: "Clinical Nutritionist | Wellness Strategist",
        image: "/trainers/4.jpg",
        specializations: [
            "Clinical & Sports Dietetics",
            "Weight Management & Metabolic Health",
            "Muscle Gain & Performance Nutrition",
            "Diabetic & Therapeutic Diet Planning",
            "Gut Health & Microbiome Nutrition",
            "Negotiation-Based Sustainable Diet Coaching",
        ],
        experience: "7+ years",
        certifications: [
            "Registered Dietitian (RD)",
            "Clinical Nutrition Specialist",
            "Sports Dietetics Certified",
            "Diabetes Nutrition Educator",
        ],
        bio: "Madurakavi is RafiHub's certified dietitian and the brain behind every member's nutrition transformation. His unique approach combines clinical nutrition science with practical lifestyle strategies — making healthy eating not just effective but sustainable. Known for his skill in understanding each client's lifestyle, culture, and food preferences, Madurakavi creates personalized diet plans that members actually enjoy following. His negotiation-based coaching style means no extreme diets, no starvation — just smart, science-backed nutrition.",
        achievements: [
            "🥗 Clinical Dietitian — 7 Years Practice",
            "🏥 Hospital & Sports Nutrition Background",
            "📋 1000+ Custom Diet Plans Created",
            "🧬 Specializes in Medical Nutrition Therapy",
            "🎯 96% Client Adherence Rate to Nutrition Plans",
            "📚 Published Nutrition Research Contributor",
        ],
        gallery: [
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
            "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80",
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
        ],
        social: { linkedin: "#", instagram: "#" },
        contact: { email: "madurakavi@rafithub.com", phone: "+91 98765 43213" },
    },
    {
        id: "prabha",
        name: "Mr. Prabha",
        role: "Yoga & Functional Fitness Coach",
        title: "Mind-Body Performance Expert | Mobility Specialist",
        image: "/trainers/5.jpg",
        specializations: [
            "Advanced Yoga & Pranayama",
            "Functional Movement & Mobility Training",
            "Injury Prevention & Rehabilitation",
            "Postural Correction & Core Stability",
            "Stress Management & Mental Wellness",
            "Flexibility & Athletic Recovery Programs",
        ],
        experience: "6+ years",
        certifications: [
            "500hr Registered Yoga Teacher (RYT 500)",
            "Functional Movement Specialist",
            "Corrective Exercise Specialist (CES)",
        ],
        bio: "Prabha is RafiHub's wellness and mobility specialist, bringing the ancient science of yoga into the modern gym environment. With a rare combination of yoga mastery and functional fitness expertise, Prabha helps members move better, recover faster, and build a body that performs as good as it looks. He works extensively with injury rehabilitation, postural correction, and stress management — making him one of the most holistic coaches at RafiHub. Members who train with Prabha don't just get fit — they feel fundamentally better.",
        achievements: [
            "🧘 Advanced Yoga Teacher Certified (500 hrs RYT)",
            "🦴 Injury Rehabilitation Specialist — 6 Years",
            "🏃 Functional Movement Screen (FMS) Certified",
            "🌟 Helped 200+ Members Recover from Sports Injuries",
            "🏅 Wellness Coach of the Year — RafiHub 2023",
            "📿 Studied Advanced Yoga at Rishikesh Yoga Institute",
        ],
        gallery: [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
            "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80",
        ],
        social: { instagram: "#" },
        contact: { email: "prabha@rafithub.com", phone: "+91 98765 43214" },
    },
    {
        id: "sophiea",
        name: "Ms. Sofia",
        role: "Women's Fitness & Lifestyle Coach",
        title: "Women's Transformation Expert | HIIT & Wellness Specialist",
        image: "/trainers/6.jpg",
        accentColor: "#4ade80",
        specializations: [
            "Women's Body Transformation & Toning",
            "HIIT, Cardio & Fat Burning Programs",
            "Pre & Postnatal Fitness Training",
            "Hormonal Health & Women's Wellness",
            "Confidence Building Through Fitness",
            "Zumba, Dance Fitness & Group Classes",
        ],
        experience: "5+ years",
        certifications: [
            "Certified Personal Trainer (Women's Specialist)",
            "Pre & Postnatal Fitness Certified",
            "HIIT & Group Fitness Instructor",
            "Women's Hormonal Health Coach",
        ],
        bio: "Sophiea is RafiHub's celebrated women's fitness coach and the heart of the gym's female community. With a passionate dedication to empowering women through fitness, she has helped hundreds of women break barriers, rebuild confidence, and achieve body transformations they once thought impossible. Sophiea's training style is fierce but empathetic — she pushes you hard while making you feel supported every step of the way. From postpartum recovery to competition prep, Sophiea handles it all with grace, expertise, and relentless energy.",
        achievements: [
            "👑 Women's Fitness Championship Finalist",
            "💃 Certified HIIT & Group Fitness Instructor",
            "🤱 Pre & Postnatal Fitness Specialist",
            "🌸 500+ Women Transformed at RafiHub",
            "🏆 Best Female Coach Award — RafiHub 2022 & 2023",
            "📸 Featured in Women's Health India Magazine",
            "💪 Women's Empowerment Fitness Ambassador",
        ],
        gallery: [
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
            "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80",
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
        ],
        social: { instagram: "#" },
        contact: { email: "sophiea@rafithub.com", phone: "+91 98765 43215" },
    },
];

export function getTrainerById(id: string): Trainer | undefined {
    return trainers.find((trainer) => trainer.id === id);
}
