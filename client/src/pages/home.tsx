import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { PortfolioShell } from "@/components/PortfolioShell";
import { AnchorNav } from "@/components/AnchorNav";
import { Section } from "@/components/Section";
import { Timeline } from "@/components/Timeline";
import { SkillMeter } from "@/components/SkillMeter";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { toast } = useToast();
  const { data: portfolio, isLoading } = useQuery({
    queryKey: [api.portfolio.get.path],
  });

  const form = useForm({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      profileId: 1,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await apiRequest("POST", api.contact.create.path, { ...data, profileId: portfolio?.profile.id || 1 });
      toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    }
  };

  if (isLoading || !portfolio) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const { profile, skills, projects, experiences, educations } = portfolio;

  return (
    <PortfolioShell>
      <Seo title={`${profile.name} | ${profile.title}`} description={profile.tagline} />
      
      <AnchorNav name={profile.name} title={profile.title} />
      
      <main className="relative">

        {/* Hero Section */}
        <section id="home" className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--mesh-color),0.1),transparent_50%)]" />
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <p className="text-xl font-semibold text-primary mb-4 sm:text-2xl">{profile.title}</p>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
                {profile.tagline}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 shadow-lg hover-elevate" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Projects
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm hover-elevate" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Contact Me
                </Button>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </section>

        {/* About Section */}
        <Section id="about" eyebrow="Introduction" title="About Me" className="py-24">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground">
              {profile.about.split('\n\n').map((p, i) => (
                <p key={i} className="mb-4 last:mb-0 leading-relaxed">{p}</p>
              ))}
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-border/70 bg-card/50 p-6 backdrop-blur-md shadow-sm">
                <h4 className="font-bold mb-4">Connect</h4>
                <div className="grid gap-3">
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors">
                      <Linkedin className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">LinkedIn</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                  )}
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors">
                      <Github className="h-5 w-5 text-foreground" />
                      <span className="text-sm font-medium">GitHub</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors">
                      <Mail className="h-5 w-5 text-accent" />
                      <span className="text-sm font-medium">Email</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Skills Section */}
        <Section id="skills" eyebrow="Expertise" title="Technical Skills" className="py-24 bg-muted/30">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(new Set(skills.map(s => s.category))).map(cat => (
              <div key={cat} className="space-y-4">
                <h3 className="text-lg font-bold px-2">{cat}</h3>
                <div className="grid gap-4">
                  {skills.filter(s => s.category === cat).map(skill => (
                    <SkillMeter key={skill.id} name={skill.name} level={skill.level} icon={skill.icon} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Qualifications Section */}
        <Section id="experience" eyebrow="Journey" title="Qualifications" description="A blend of professional experience and academic foundation." className="py-24">
          <div className="space-y-16">
            <div>
              <h3 className="text-xl font-bold mb-8 inline-flex items-center gap-3">
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-primary/10 text-primary">💼</span>
                Experience
              </h3>
              <Timeline items={experiences} />
            </div>
            
            <div id="education" className="scroll-mt-24">
              <h3 className="text-xl font-bold mb-8 inline-flex items-center gap-3">
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-accent/10 text-accent">🎓</span>
                Education
              </h3>
              <div className="grid gap-6">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm transition-all hover:bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold">{edu.degree}</h4>
                        <p className="text-primary font-medium">{edu.school}</p>
                        <p className="text-sm text-muted-foreground mt-1">{edu.field}</p>
                      </div>
                      <div className="text-sm font-bold text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full h-fit">
                        {edu.startYear} — {edu.endYear}
                      </div>
                    </div>
                    {edu.description && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects" eyebrow="Portfolio" title="Featured Projects" className="py-24 bg-muted/30">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" eyebrow="Get in touch" title="Let’s Work Together" className="py-24">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-border/70 bg-card/50 p-8 backdrop-blur-xl shadow-xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="Your name" {...field} className="rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="your@email.com" {...field} className="rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl><Input placeholder="What's this about?" {...field} className="rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl><Textarea placeholder="Your message..." {...field} className="min-h-[150px] rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold hover-elevate shadow-lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </Section>
      </main>

      <Footer profile={profile} />
    </PortfolioShell>
  );
}
