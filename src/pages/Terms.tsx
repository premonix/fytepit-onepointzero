import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react";


const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: [
        "By accessing and using FYTEPIT, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms may be updated from time to time, and your continued use constitutes acceptance of any changes."
      ]
    },
    {
      title: "2. Platform Description",
      icon: FileText,
      content: [
        "FYTEPIT is an AI-powered combat arena platform that allows users to own fractional shares of digital fighters, participate in battles, and create custom realms.",
        "The platform includes features for viewing battles, fighter ownership, betting mechanics, and world creation tools.",
        "All fighter battles are simulated using AI technology and do not involve real physical combat."
      ]
    },
    {
      title: "3. User Accounts and Responsibilities",
      icon: Shield,
      content: [
        "Users must provide accurate, current, and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account and password.",
        "You agree to accept responsibility for all activities that occur under your account.",
        "Users must be at least 18 years old to participate in any betting features (when available)."
      ]
    },
    {
      title: "4. Betting and Financial Disclaimer",
      icon: AlertTriangle,
      content: [
        "IMPORTANT: FYTEPIT does not currently hold a gambling license and betting features are for demonstration purposes only.",
        "No real money betting is currently available on the platform.",
        "Any 'betting' functionality shown is part of the platform's educational and entertainment features.",
        "We are working towards proper licensing and regulatory compliance for future real-money features."
      ]
    },
    {
      title: "5. Fighter Ownership",
      icon: FileText,
      content: [
        "Fighter ownership represents a digital asset within the FYTEPIT platform.",
        "Ownership shares grant users certain platform benefits and potential future revenue sharing.",
        "Fighter assets are platform-specific and do not constitute traditional securities or investments.",
        "The platform reserves the right to modify fighter mechanics and features as needed."
      ]
    },
    {
      title: "6. Prohibited Uses",
      icon: AlertTriangle,
      content: [
        "Users may not use the platform for any illegal or unauthorized purpose.",
        "You may not transmit any worms, viruses, or any code of a destructive nature.",
        "Attempting to exploit, hack, or manipulate the platform is strictly prohibited.",
        "Users must not harass, abuse, or harm other users of the platform."
      ]
    },
    {
      title: "7. Intellectual Property",
      icon: Shield,
      content: [
        "All content, features, and functionality on FYTEPIT are owned by DYP Media & Publishing Limited.",
        "Users retain rights to content they create through the WorldForge feature, subject to platform usage rights.",
        "The FYTEPIT brand, logos, and trademarks are protected intellectual property.",
        "Users may not reproduce, duplicate, or copy any part of the platform without permission."
      ]
    },
    {
      title: "8. Limitation of Liability",
      icon: AlertTriangle,
      content: [
        "FYTEPIT is provided 'as is' without any warranties, expressed or implied.",
        "We shall not be liable for any indirect, incidental, or consequential damages.",
        "The platform's liability is limited to the maximum extent permitted by law.",
        "Users participate in platform activities at their own risk."
      ]
    },
    {
      title: "9. Privacy and Data",
      icon: Shield,
      content: [
        "User privacy is governed by our Privacy Policy, which forms part of these terms.",
        "We collect and use data in accordance with applicable privacy laws.",
        "Users have rights regarding their personal data as outlined in our Privacy Policy.",
        "We implement security measures to protect user information."
      ]
    },
    {
      title: "10. Termination",
      icon: AlertTriangle,
      content: [
        "Either party may terminate this agreement at any time.",
        "Upon termination, your right to use the platform ceases immediately.",
        "We reserve the right to suspend or terminate accounts for violations of these terms.",
        "Termination does not affect any rights or obligations that existed prior to termination."
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
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Terms of Service
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

      {/* Terms Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                  Important Notice
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                  FYTEPIT is currently in development and does not hold gambling licenses. 
                  Betting features are for demonstration only. Please read these terms carefully 
                  before using our platform.
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
            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>DYP Media & Publishing Limited</p>
              <p>Email: legal@fytepit.com</p>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default Terms;