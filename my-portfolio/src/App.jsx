import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Code2, Sparkles, Terminal, Cpu, Layers, Award, ExternalLink, ChevronDown, Menu, X, Zap, Star } from 'lucide-react';
import { Gi3dGlasses, Gi3dHammer, GiAerialSignal, GiAnchor } from "react-icons/gi";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  
  const zoomContainerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  // Load GSAP
  useEffect(() => {
    const loadGSAP = async () => {
      if (window.gsap) {
        setGsapLoaded(true);
        return;
      }

      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script1.async = true;
      
      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      script2.async = true;

      script1.onload = () => {
        script2.onload = () => {
          setGsapLoaded(true);
        };
        document.body.appendChild(script2);
      };
      
      document.body.appendChild(script1);
    };

    loadGSAP();
  }, []);

  // GSAP Zoom Animation
  useEffect(() => {
    if (!gsapLoaded || !window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    gsap.registerPlugin(ScrollTrigger);

    // Calculate the position of the left eye (approximately 60% from left, 42% from top)
    const eyeX = 60; // percentage
    const eyeY = 42; // percentage

    // Create zoom animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: zoomContainerRef.current,
        start: 'top top',
        end: '+=2000',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Zoom into the eye with transform-origin at eye position
    tl.to(imageRef.current, {
      scale: 15,
      transformOrigin: `${eyeX}% ${eyeY}%`,
      ease: 'power2.inOut',
      duration: 1
    })
    // Fade out the image as we get very close
    .to(imageRef.current, {
      opacity: 0,
      duration: 0.3
    }, '-=0.3')
    // Fade in the overlay for the "portal" effect
    .to(overlayRef.current, {
      opacity: 1,
      duration: 0.4
    }, '-=0.3')
    // Fade in the content
    .to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2');

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [gsapLoaded]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.animateId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate-id]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getBackgroundGradient = () => {
    const colorStops = [
      { pos: 0, from: [2, 6, 23], via: [15, 23, 42], to: [2, 6, 23] },
      { pos: 33, from: [15, 23, 42], via: [23, 37, 84], to: [15, 23, 42] },
      { pos: 66, from: [23, 37, 84], via: [8, 51, 68], to: [23, 37, 84] },
      { pos: 100, from: [8, 51, 68], via: [22, 78, 99], to: [30, 58, 138] }
    ];

    let startStop = colorStops[0];
    let endStop = colorStops[1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (scrollProgress >= colorStops[i].pos && scrollProgress <= colorStops[i + 1].pos) {
        startStop = colorStops[i];
        endStop = colorStops[i + 1];
        break;
      }
    }

    const range = endStop.pos - startStop.pos;
    const factor = range === 0 ? 0 : (scrollProgress - startStop.pos) / range;

    const lerp = (start, end, t) => Math.round(start + (end - start) * t);

    const from = startStop.from.map((v, i) => lerp(v, endStop.from[i], factor));
    const via = startStop.via.map((v, i) => lerp(v, endStop.via[i], factor));
    const to = startStop.to.map((v, i) => lerp(v, endStop.to[i], factor));

    return `linear-gradient(to bottom right, rgb(${from.join(',')}), rgb(${via.join(',')}), rgb(${to.join(',')}))`;
  };

  const parallaxOffset = (speed) => scrollY * speed;

  const getZoomScale = (baseScroll, range) => {
    const distance = Math.abs(scrollY - baseScroll);
    const scale = Math.max(0.8, 1 - (distance / range) * 0.2);
    return Math.min(1.2, scale);
  };

  const skills = [
    { name: 'React, React Native & Next.js', level: 95, icon: Layers, color: 'from-cyan-500 to-blue-500' },
    { name: 'Python, Java, Django ...', level: 92, icon: Code2, color: 'from-green-500 to-emerald-500' },
    { name: 'Machine Learning', level: 88, icon: Cpu, color: 'from-purple-500 to-pink-500' },
    { name: 'Cloud Architecture', level: 86, icon: Sparkles, color: 'from-orange-500 to-red-500' },
    { name: 'System Design', level: 87, icon: Terminal, color: 'from-yellow-500 to-orange-500' },
    { name: 'Blockchain', level: 70, icon: Award, color: 'from-indigo-500 to-purple-500' },
    { name: 'Git', level: 90, icon: Github, color: 'from-red-500 to-orange-500' },
    { name: 'Docker', level: 85, icon: GiAnchor, color: 'from-blue-500 to-cyan-500' },
    { name: 'Data Analytics', level: 82, icon: Gi3dGlasses, color: 'from-pink-500 to-purple-500' },
  ];

  const projects = [
    {
      title: 'AI-Powered Code Analyzer',
      description: 'Machine learning system that analyzes code quality and suggests optimizations in real-time',
      tech: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Decentralized Finance Platform',
      description: 'Full-stack DeFi application with smart contracts for secure peer-to-peer transactions',
      tech: ['Solidity', 'Ethereum', 'Web3.js', 'Node.js'],
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      title: 'Real-time Collaboration Suite',
      description: 'Cloud-native platform enabling seamless team collaboration with WebRTC and WebSockets',
      tech: ['Next.js', 'WebRTC', 'Redis', 'Kubernetes'],
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      title: 'Serverless E-commerce Platform',
      description: 'Scalable e-commerce solution using serverless architecture for cost-effective performance',
      tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'React'],
      gradient: 'from-orange-600 to-yellow-600'
    },
    {
      title: 'Data Visualization Dashboard',
      description: 'Real-time dashboard for visualizing complex datasets with interactive charts and graphs',
      tech: ['D3.js', 'React', 'WebSocket', 'Python'],
      gradient: 'from-red-600 to-pink-600'
    },
    {
      title: 'Full-Stack Property Management System with Cross-Platform Compatibility',
      description: 'A web-based and stand-alone system to manage rental properties, tenants, and payments.',
      tech: ['PHP', 'MySQL', 'React', 'Electron'],
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Real-Time Food Delivery and Logistics Platform',
      description: 'A mobile application for ordering food from local restaurants, with real-time order tracking.',
      tech: ['React Native', 'Firebase', 'Node.js', 'Express'],
      gradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'AI-Powered Personalized Learning and Study Assistant',
      description: 'An AI-powered agent that helps students with their studies by providing explanations, summaries, and practice questions.',
      tech: ['Python', 'TensorFlow', 'Natural Language Processing', 'Django'],
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Dynamic and Responsive Portfolio Generation Platform',
      description: 'Modern and responsive portfolio websites for developers, designers, and other professionals.',
      tech: ['React', 'Next.js', 'Tailwind CSS', 'GSAP'],
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const scrollToSection = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen text-white overflow-hidden transition-all duration-300"
      style={{ background: getBackgroundGradient() }}
    >
      {/* Dynamic floating background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl transition-all duration-300"
          style={{
            top: `${20 - parallaxOffset(0.1)}%`,
            left: `${10 + parallaxOffset(0.05)}%`,
            transform: `scale(${1 + scrollProgress / 100})`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transition-all duration-300"
          style={{
            bottom: `${10 + parallaxOffset(0.08)}%`,
            right: `${15 - parallaxOffset(0.06)}%`,
            transform: `scale(${1.2 - scrollProgress / 200})`
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transition-all duration-300"
          style={{
            top: `${50 + parallaxOffset(0.12)}%`,
            right: `${20 - parallaxOffset(0.07)}%`,
            transform: `scale(${0.8 + scrollProgress / 150})`
          }}
        />
      </div>

      <div 
        className="fixed inset-0 opacity-30 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <Zap
          className="absolute text-cyan-400"
          style={{
            top: `${15 + parallaxOffset(0.15)}%`,
            left: `${80 - parallaxOffset(0.1)}%`,
            transform: `rotate(${scrollProgress * 2}deg) scale(${1 + Math.sin(scrollProgress / 20)})`,
            width: '48px',
            height: '48px'
          }}
        />
        <Star
          className="absolute text-purple-400"
          style={{
            top: `${60 - parallaxOffset(0.2)}%`,
            left: `${10 + parallaxOffset(0.12)}%`,
            transform: `rotate(${-scrollProgress * 1.5}deg) scale(${1.2 - Math.cos(scrollProgress / 15) * 0.3})`,
            width: '40px',
            height: '40px'
          }}
        />
        <Code2
          className="absolute text-blue-400"
          style={{
            bottom: `${20 + parallaxOffset(0.18)}%`,
            right: `${70 - parallaxOffset(0.14)}%`,
            transform: `rotate(${scrollProgress}deg) scale(${0.8 + Math.sin(scrollProgress / 25) * 0.4})`,
            width: '56px',
            height: '56px'
          }}
        />
      </div>

      {/* Floating navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Terminal 
              className="w-6 h-6 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" 
              style={{ transform: `rotate(${scrollProgress}deg)` }}
            />
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              James Magara
            </span>
          </div>
          
          <div className="hidden md:flex gap-8">
            {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="relative group text-slate-300 hover:text-white transition-colors"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
            <div className="flex flex-col p-6 gap-4">
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-left text-slate-300 hover:text-white transition-colors py-2"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 py-20">
        <div
          className="max-w-5xl mx-auto text-center space-y-6 transition-all duration-500"
          style={{
            transform: `scale(${getZoomScale(0, 800)}) translateY(${parallaxOffset(-0.3)}px)`,
            opacity: Math.max(0.3, 1 - scrollProgress / 30)
          }}
        >
          <div className="inline-block animate-pulse opacity-0 animate-fade-in">
            <span className="text-cyan-400 text-lg font-mono">404 Found! 👋</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold leading-tight opacity-0 animate-fade-in-delay-1">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Building the Future
            </span>
            <br />
            <span className="text-white">One Line at a Time</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-delay-2">
            Final-year Computer Science student at <span className="text-cyan-400 font-semibold">Strathmore University</span>
            {' '}crafting innovative solutions as a means to quell curiosity & scratch a creative itch.
          </p>

          <div className="flex flex-wrap gap-6 justify-center pt-6 opacity-0 animate-fade-in-delay-3">
            <button 
              onClick={() => scrollToSection('projects')}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 border-2 border-cyan-400 rounded-full font-semibold text-lg hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105"
            >
              Get In Touch
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                transform: `translateY(${parallaxOffset(0.05 * i)}px)`
              }}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-6 relative">
        <div
          className="max-w-6xl mx-auto transition-all duration-500"
          style={{
            transform: `scale(${getZoomScale(1000, 1000)}) perspective(1000px) rotateX(${Math.min(5, scrollProgress / 20 - 2)}deg)`,
          }}
        >
          <h2
            data-animate-id="about-title"
            className={`text-5xl font-bold mb-16 text-center transition-all duration-1000 ${
              visibleElements.has('about-title')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{
              color: scrollProgress > 25 ? '#22d3ee' : '#ffffff'
            }}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div
                data-animate-id="about-text-1"
                className={`p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-1000 ${
                  visibleElements.has('about-text-1')
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10'
                }`}
              >
                <p className="text-lg text-slate-300 leading-relaxed">
                  I'm a passionate scientist and problem-solver currently completing my final year in Computer Science at Strathmore University. With a foundation built at one of Kenya's premier institutions, Alliance High School, I've developed a unique blend of theoretical knowledge and practical expertise.
                </p>
              </div>

              <div
                data-animate-id="about-text-2"
                className={`p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-1000 delay-200 ${
                  visibleElements.has('about-text-2')
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10'
                }`}
              >
                <p className="text-lg text-slate-300 leading-relaxed">
                  My journey spans full-stack development, machine learning, cybersecurity, cloud architecture, and blockchain technology. I thrive on transforming complex challenges into elegant, 'awe-full' solutions that make a real-world impact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Years Coding', value: '6+' },
                { label: 'Projects Built', value: '50+' },
                { label: 'Technologies', value: '30+' },
                { label: 'Coffee Cups', value: '∞' }
              ].map((stat, i) => (
                <div
                  key={i}
                  data-animate-id={`stat-${i}`}
                  className={`p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-1000 hover:scale-105 text-center group ${
                    visibleElements.has(`stat-${i}`)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 px-6 relative">
        <div 
          className="max-w-6xl mx-auto transition-all duration-500"
          style={{
            transform: `scale(${getZoomScale(2200, 1000)})`,
          }}
        >
          <h2 
            data-animate-id="skills-title"
            className={`text-5xl font-bold mb-16 text-center transition-all duration-1000 ${
              visibleElements.has('skills-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Technical Arsenal
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <div
                  key={i}
                  data-animate-id={`skill-${i}`}
                  className={`group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-1000 cursor-pointer ${
                    visibleElements.has(`skill-${i}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: `${i * 150}ms`,
                    transform: `translateY(${-parallaxOffset(0.02 * i)}px)`
                  }}
                  onMouseEnter={() => setHoveredSkill(i)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 bg-gradient-to-br ${skill.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{skill.name}</h3>
                  </div>

                  <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: hoveredSkill === i ? `${skill.level}%` : '0%' }}
                    />
                  </div>
                  <div className="text-right text-sm text-slate-400 mt-2">
                    {hoveredSkill === i ? `${skill.level}%` : 'Hover to reveal'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2
            data-animate-id="projects-title"
            className={`text-5xl font-bold mb-16 text-center transition-all duration-1000 ${
              visibleElements.has('projects-title')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>

          <div
            className="grid md:grid-cols-3 gap-8 transition-all duration-500"
            style={{
              transform: `scale(${getZoomScale(3500, 1000)}) perspective(1000px) rotateY(${Math.max(-5, Math.min(5, (scrollProgress - 70) / 2))}deg)`,
            }}
          >
            {projects.map((project, i) => (
              <div
                key={i}
                data-animate-id={`project-${i}`}
                className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-400/50 transition-all duration-1000 hover:scale-105 ${
                  visibleElements.has(`project-${i}`) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${i * 200}ms`,
                  transform: `translateY(${-parallaxOffset(0.03 * (i + 1))}px) rotateZ(${Math.sin(scrollProgress / 20 + i) * 2}deg)`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <Code2 className="w-8 h-8 text-cyan-400" />
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <h3 className="text-2xl font-bold group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-cyan-400 border border-cyan-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 relative">
        <div 
          className="max-w-4xl mx-auto text-center transition-all duration-500"
          style={{
            transform: `scale(${getZoomScale(4500, 1000)})`,
          }}
        >
          <h2 
            data-animate-id="contact-title"
            className={`text-5xl font-bold mb-8 transition-all duration-1000 ${
              visibleElements.has('contact-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Let's Build Something Amazing
            </span>
          </h2>

          <p 
            data-animate-id="contact-text"
            className={`text-xl text-slate-300 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
              visibleElements.has('contact-text') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            Whether you're looking for a talented developer for your team or want to collaborate on an exciting project, I'd love to hear from you.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Github, label: 'GitHub', link: 'github.com/jm-0-magara' },
              { icon: Linkedin, label: 'LinkedIn', link: 'linkedin.com/in/jm-0-magara' },
              { icon: Mail, label: 'Email', link: 'jm.0.magara@gmail.com' }
            ].map((contact, i) => {
              const Icon = contact.icon;
              return (
                <a
                  key={i}
                  href="#"
                  data-animate-id={`contact-${i}`}
                  className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-full border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-1000 hover:scale-105 ${
                    visibleElements.has(`contact-${i}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <Icon className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span className="font-semibold">{contact.link}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            Designed & Built with <span className="text-cyan-400">❤</span> by Magara
          </p>
          <p className="text-slate-500 text-sm mt-2">
            © 2025 All rights reserved
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-delay-1 {
          animation: fadeIn 1s ease-out 0.3s forwards;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.6s forwards;
        }
        .animate-fade-in-delay-3 {
          animation: fadeIn 1s ease-out 0.9s forwards;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;