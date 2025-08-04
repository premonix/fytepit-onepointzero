import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from "lucide-react";


const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Account Information: Email address, username, and profile details you provide during registration.",
        "Usage Data: Information about how you interact with our platform, including pages visited and features used.",
        "Fighter Data: Your fighter ownership records, battle history, and game progression.",
        "Technical Data: IP address, browser type, device information, and cookies for platform functionality.",
        "Payment Information: When available, payment details are processed securely through third-party providers."
      ]
    },
    {
      title: "How We Use Your Information",
      icon: UserCheck,
      content: [
        "Platform Operation: To provide core FYTEPIT services including fighter ownership and battle features.",
        "Account Management: To create and maintain your user account and preferences.",
        "Communication: To send important updates, platform notifications, and customer support responses.",
        "Improvement: To analyze usage patterns and improve platform features and performance.",
        "Legal Compliance: To comply with applicable laws and respond to legal requests when required."
      ]
    },
    {
      title: "Information Sharing",
      icon: Eye,
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "Service Providers: We may share data with trusted service providers who assist in platform operations.",
        "Legal Requirements: We may disclose information when required by law or to protect our rights and users.",
        "Business Transfers: In the event of a merger or acquisition, user data may be transferred as part of business assets.",
        "Public Information: Fighter statistics and leaderboard data may be publicly displayed as part of platform features."
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "We implement industry-standard security measures to protect your personal information.",
        "All data transmission is encrypted using SSL/TLS protocols.",
        "Access to personal data is restricted to authorized personnel only.",
        "We regularly update our security practices and conduct security assessments.",
        "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
      ]
    },
    {
      title: "Your Privacy Rights",
      icon: Shield,
      content: [
        "Access: You can request access to the personal information we hold about you.",
        "Correction: You can update or correct your personal information through your account settings.",
        "Deletion: You can request deletion of your account and associated personal data.",
        "Portability: You can request a copy of your data in a structured, machine-readable format.",
        "Opt-out: You can unsubscribe from marketing communications at any time."
      ]
    },
    {
      title: "Cookies and Tracking",
      icon: Eye,
      content: [
        "We use cookies to enhance your experience and maintain your login session.",
        "Analytics cookies help us understand how users interact with our platform.",
        "Functional cookies remember your preferences and settings.",
        "You can control cookie settings through your browser, though this may affect platform functionality.",
        "We do not use cookies for advertising or tracking across other websites."
      ]
    },
    {
      title: "Third-Party Services",
      icon: Database,
      content: [
        "Authentication: We use Supabase for secure user authentication and data storage.",
        "Analytics: We may use analytics services to understand platform usage patterns.",
        "Payment Processing: When available, payments are processed through secure third-party providers.",
        "These services have their own privacy policies, which we encourage you to review.",
        "We carefully select service providers that maintain high privacy and security standards."
      ]
    },
    {
      title: "Children's Privacy",
      icon: Shield,
      content: [
        "FYTEPIT is not intended for children under 13 years of age.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware that we have collected information from a child under 13, we will delete it promptly.",
        "Parents who believe their child has provided information to us should contact us immediately.",
        "Users must be 18 or older to participate in any betting features (when available)."
      ]
    },
    {
      title: "International Users",
      icon: Database,
      content: [
        "FYTEPIT is operated from the United Kingdom by DYP Media & Publishing Limited.",
        "Your information may be transferred to and stored in the UK or other countries where our service providers operate.",
        "We ensure appropriate safeguards are in place for international data transfers.",
        "By using our platform, you consent to the transfer of your information as described.",
        "We comply with applicable international privacy laws and regulations."
      ]
    },
    {
      title: "Changes to This Policy",
      icon: AlertTriangle,
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.",
        "We will notify users of significant changes through the platform or via email.",
        "The 'Last Updated' date at the top of this policy indicates when changes were last made.",
        "Your continued use of the platform after changes constitutes acceptance of the updated policy.",
        "We encourage you to review this policy periodically to stay informed about how we protect your information."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Last Updated: December 2024
          </motion.p>
        </div>
      </motion.section>

      {/* Privacy Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  Your Privacy Matters
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                  At FYTEPIT, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This policy explains how we collect, use, and protect your data when you use our platform.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.content.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Section */}
          <motion.div
            className="mt-16 text-center bg-muted/50 rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Privacy Questions or Concerns?</h3>
            <p className="text-muted-foreground mb-6">
              If you have questions about this Privacy Policy or how we handle your data, please contact us.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>DYP Media & Publishing Limited</p>
              <p>Data Protection Officer</p>
              <p>Email: privacy@fytepit.com</p>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default Privacy;