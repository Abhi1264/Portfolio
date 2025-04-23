"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { IoLogoGithub } from "react-icons/io";
import { ImLinkedin2 } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { IoLogoInstagram } from "react-icons/io5";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "abhinav.kumar.1264@gmail.com",
      href: "mailto:abhinav.kumar.1264@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 9939 110 848",
      href: "tel:+919939110848",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Ranchi, Jharkhand, India",
      href: null,
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        "service_cikqweu",
        "template_bjomo7q",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "MqilJf3TJkMB9o45b"
      );

      toast.success("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.", {
        description: "Please try again later.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground">
            Have a project in mind or want to discuss a collaboration? Feel free
            to reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-black/50 border border-purple-500/20 overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div className="flex items-start gap-4" key={info.label}>
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-purple-300">
                        {info.label}
                      </h4>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-muted-foreground hover:text-purple-400 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-300"
                    asChild
                  >
                    <a
                      href="https://github.com/Abhi1264"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IoLogoGithub className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-300"
                    asChild
                  >
                    <a
                      href="https://www.linkedin.com/in/abhinav-kumar-choudhary-784062288/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ImLinkedin2 className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-300"
                    asChild
                  >
                    <a
                      href="https://x.com/akc1264"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BsTwitterX className="h-5 w-5" />
                      <span className="sr-only">X</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-300"
                    asChild
                  >
                    <a
                      href="https://www.instagram.com/poetry_aficionado/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IoLogoInstagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border border-purple-500/20 overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6">Send Me a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-black/30 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-black/30 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-black/30 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[120px] bg-black/30 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>

                <Button
                  type="submit"
                  className=" bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
