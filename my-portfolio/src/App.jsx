import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Code2, Sparkles, Terminal, Cpu, Layers, Award, ExternalLink, ChevronDown, Menu, X, TrendingUp, Users, Coffee, Briefcase, CheckCircle, ArrowRight, Eye, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Gi3dGlasses, GiAnchor } from "react-icons/gi";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [particles, setParticles] = useState([]);
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    clients: 0,
    coffee: 0
  });
  
  const zoomContainerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const titles = ['Full-Stack Developer', 'AI Engineer', 'Blockchain Developer', 'Problem Solver'];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing animation effect
  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timer = setTimeout(() => {
      if (!isDeleting && typedText === currentTitle) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      } else {
        setTypedText(
          isDeleting
            ? currentTitle.substring(0, typedText.length - 1)
            : currentTitle.substring(0, typedText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentTitleIndex]);

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + 100) % 100,
        y: (particle.y + particle.speedY + 100) % 100
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Stats counter animation
  useEffect(() => {
    if (visibleElements.has('stats-section')) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      const targetStats = {
        projects: 50,
        experience: 5,
        clients: 30,
        coffee: 1500
      };

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          projects: Math.floor(targetStats.projects * progress),
          experience: Math.floor(targetStats.experience * progress),
          clients: Math.floor(targetStats.clients * progress),
          coffee: Math.floor(targetStats.coffee * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setStats(targetStats);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [visibleElements]);

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

  // GSAP Zoom Animation - FIXED
  useEffect(() => {
    if (!gsapLoaded || !window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    gsap.registerPlugin(ScrollTrigger);

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const eyeX = 60;
    const eyeY = 42;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: zoomContainerRef.current,
        start: 'top top',
        end: '+=2000',
        scrub: true, // Changed from 1 to true for smoother handling
        pin: true,
        pinSpacing: true, // Ensures proper spacing
        anticipatePin: 1,
        invalidateOnRefresh: true, // Recalculate on refresh
        refreshPriority: 1, // Higher priority for this trigger
        onUpdate: (self) => {
          // Optional: log progress for debugging
          // console.log('Progress:', self.progress);
        }
      }
    });

    // Store reference
    scrollTriggerRef.current = tl.scrollTrigger;

    tl.to(imageRef.current, {
      scale: 15,
      transformOrigin: `${eyeX}% ${eyeY}%`,
      ease: 'power2.inOut',
      duration: 1
    })
    .to(imageRef.current, {
      opacity: 0,
      duration: 0.3
    }, '-=0.3')
    .to(overlayRef.current, {
      opacity: 1,
      duration: 0.4
    }, '-=0.3')
    .to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2');

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [gsapLoaded]);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / totalHeight) * 100;
          setScrollProgress(progress);
          setScrollY(window.scrollY);
          
          // Update active section
          const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
          const current = sections.find(section => {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              return rect.top <= 100 && rect.bottom >= 100;
            }
            return false;
          });
          if (current) setActiveSection(current);
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const skills = [
    { 
      name: 'React & Next.js', 
      level: 95, 
      icon: Layers, 
      color: 'from-cyan-500 to-blue-500',
      category: 'Frontend',
      projects: 25
    },
    { 
      name: 'Python & Django', 
      level: 92, 
      icon: Code2, 
      color: 'from-green-500 to-emerald-500',
      category: 'Backend',
      projects: 30
    },
    { 
      name: 'Machine Learning', 
      level: 88, 
      icon: Cpu, 
      color: 'from-purple-500 to-pink-500',
      category: 'AI/ML',
      projects: 15
    },
    { 
      name: 'Cloud Architecture', 
      level: 86, 
      icon: Sparkles, 
      color: 'from-orange-500 to-red-500',
      category: 'DevOps',
      projects: 20
    },
    { 
      name: 'System Design', 
      level: 87, 
      icon: Terminal, 
      color: 'from-yellow-500 to-orange-500',
      category: 'Architecture',
      projects: 18
    },
    { 
      name: 'Blockchain', 
      level: 70, 
      icon: Award, 
      color: 'from-indigo-500 to-purple-500',
      category: 'Web3',
      projects: 8
    },
  ];

  const projects = [
    {
      title: 'AI-Powered Code Analyzer',
      description: 'Machine learning system that analyzes code quality and suggests optimizations in real-time using advanced NLP and static analysis',
      tech: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      gradient: 'from-purple-600 to-pink-600',
      features: ['Real-time Analysis', 'ML-Powered', 'Auto-optimization'],
      stats: { users: '10K+', accuracy: '94%', speed: '<100ms' }
    },
    {
      title: 'Decentralized Finance Platform',
      description: 'Full-stack DeFi application with smart contracts for secure peer-to-peer transactions and automated market making',
      tech: ['Solidity', 'Ethereum', 'Web3.js', 'Node.js'],
      gradient: 'from-cyan-600 to-blue-600',
      features: ['Smart Contracts', 'P2P Trading', 'Secure Wallet'],
      stats: { tvl: '$2M+', transactions: '50K+', apy: '12%' }
    },
    {
      title: 'Real-time Analytics Dashboard',
      description: 'Enterprise-grade dashboard with real-time data visualization and predictive analytics for business intelligence',
      tech: ['React', 'D3.js', 'WebSocket', 'MongoDB'],
      gradient: 'from-green-600 to-teal-600',
      features: ['Live Data', 'Predictive AI', 'Custom Charts'],
      stats: { dataPoints: '1M+', latency: '<50ms', uptime: '99.9%' }
    },
    {
      title: 'Cloud Infrastructure Manager',
      description: 'Automated cloud resource management with cost optimization, auto-scaling, and multi-cloud support',
      tech: ['AWS', 'Terraform', 'Python', 'Docker'],
      gradient: 'from-orange-600 to-red-600',
      features: ['Auto-scaling', 'Cost Optimization', 'Multi-cloud'],
      stats: { savings: '40%', servers: '500+', deployment: '<5min' }
    },
    {
      title: 'Mobile Fitness App',
      description: 'Cross-platform fitness tracking app with AI-powered workout recommendations and social features',
      tech: ['React Native', 'Firebase', 'TensorFlow', 'Redux'],
      gradient: 'from-pink-600 to-purple-600',
      features: ['AI Workouts', 'Progress Tracking', 'Social Features'],
      stats: { downloads: '100K+', rating: '4.8★', retention: '85%' }
    },
    {
      title: 'E-commerce Platform',
      description: 'Scalable e-commerce solution with microservices architecture, payment integration, and inventory management',
      tech: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
      gradient: 'from-blue-600 to-indigo-600',
      features: ['Microservices', 'Payment Gateway', 'Inventory System'],
      stats: { gmv: '$5M+', orders: '200K+', conversion: '3.2%' }
    }
  ];

  const handleProjectNavigation = (direction) => {
    if (direction === 'next') {
      setActiveProjectIndex((prev) => (prev + 1) % projects.length);
    } else {
      setActiveProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };

  const getProjectTransform = (index) => {
    const diff = index - activeProjectIndex;
    
    if (diff === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 50,
        opacity: 1,
        pointerEvents: 'auto'
      };
    } else if (diff === 1 || diff === -(projects.length - 1)) {
      return {
        transform: 'translateX(65%) scale(0.8) rotateY(-20deg)',
        zIndex: 40,
        opacity: 0.6,
        pointerEvents: 'auto'
      };
    } else if (diff === -1 || diff === (projects.length - 1)) {
      return {
        transform: 'translateX(-65%) scale(0.8) rotateY(20deg)',
        zIndex: 40,
        opacity: 0.6,
        pointerEvents: 'auto'
      };
    } else if (diff === 2 || diff === -(projects.length - 2)) {
      return {
        transform: 'translateX(100%) scale(0.65) rotateY(-30deg)',
        zIndex: 30,
        opacity: 0.3,
        pointerEvents: 'auto'
      };
    } else if (diff === -2 || diff === (projects.length - 2)) {
      return {
        transform: 'translateX(-100%) scale(0.65) rotateY(30deg)',
        zIndex: 30,
        opacity: 0.3,
        pointerEvents: 'auto'
      };
    } else {
      return {
        transform: `translateX(${diff > 0 ? '120%' : '-120%'}) scale(0.5)`,
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none'
      };
    }
  };

  return (
    <div 
      className="min-h-screen text-white font-sans relative overflow-x-hidden"
      style={{ background: getBackgroundGradient() }}
    >
      {/* Animated Particles Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px rgba(34, 211, 238, 0.5)`,
              transition: 'all 0.05s linear'
            }}
          />
        ))}
      </div>

      {/* Progress Bar - Above Everything */}
      <div className="fixed top-0 left-0 w-full h-1 z-[110]">
        <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-sm" />
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute right-0 top-0 w-2 h-full bg-white rounded-full shadow-lg shadow-cyan-400/50" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 mt-1 backdrop-blur-md bg-slate-900/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Portfolio
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 md:top-auto bg-slate-900/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b md:border-0 border-slate-800/50 gap-2 md:gap-8 p-6 md:p-0`}>
            {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-slate-300 hover:text-cyan-400 transition-all font-medium relative group ${
                  activeSection === item.toLowerCase() ? 'text-cyan-400' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                  activeSection === item.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Enhanced Zoom Container - Cleaned Up */}
      <div ref={zoomContainerRef} className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div 
          ref={imageRef} 
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'transform, opacity' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1920&h=1080&fit=crop"
            alt="Developer workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>

        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />

        {/* Pulsing Square - ONLY geometric shape kept */}
        <div className="absolute bottom-40 right-20 w-40 h-40 border-2 border-blue-400/20 rotate-45 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }} />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-0"
          style={{ willChange: 'opacity' }}
        />
        
        <div 
          ref={contentRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-10"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="text-center px-6 relative">
            {/* Animated rings around text */}
            <div className="absolute inset-0 -m-20 pointer-events-none">
              <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent inline-block animate-gradient">
                Welcome
              </span>
              {/* Sparkle effects */}
              <Star className="absolute -top-4 -right-8 w-6 h-6 text-cyan-400 animate-pulse" style={{ animationDuration: '2s' }} />
              <Sparkles className="absolute -bottom-2 -left-6 w-5 h-5 text-blue-400 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            </h1>
            
            <div className="relative">
              <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-4">
                Scroll to explore my journey
              </p>
              
              {/* Animated underline */}
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
            </div>

            {/* Scroll indicator with animation */}
            <div className="mt-12 flex flex-col items-center gap-3 animate-bounce">
              <ChevronDown className="w-8 h-8 text-cyan-400" />
              <div className="flex gap-1">
                <div className="w-1 h-8 bg-cyan-400/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-8 bg-cyan-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-8 bg-cyan-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div 
            data-animate-id="hero-title"
            className={`transition-all duration-1000 ${
              visibleElements.has('hero-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="mb-8 inline-block">
              <div className="px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full backdrop-blur-sm">
                <span className="text-cyan-400 font-semibold">👋 Welcome to my portfolio</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                James Magara
              </span>
            </h1>
            
            <div className="h-16 mb-8">
              <p className="text-2xl md:text-4xl text-slate-300">
                {typedText}
                <span className="inline-block w-1 h-8 md:h-10 bg-cyan-400 ml-1 animate-pulse" />
              </p>
            </div>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Crafting innovative solutions at the intersection of web development, 
              machine learning, and blockchain technology. Transforming ideas into reality.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a
                href="#projects"
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2"
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border-2 border-cyan-400/50 rounded-full font-semibold hover:bg-cyan-400/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                Get in Touch
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6">
              {[
                { icon: Github, href: 'https://github.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Mail, href: 'mailto:jm.0.magara@gmail.com' }
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-full hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-110 transition-all duration-300 backdrop-blur-sm group"
                  >
                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section 
        data-animate-id="stats-section"
        className="py-20 px-6 relative"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: stats.projects, label: 'Projects Completed', icon: Briefcase, suffix: '+' },
              { value: stats.experience, label: 'Years Experience', icon: TrendingUp, suffix: '+' },
              { value: stats.clients, label: 'Happy Clients', icon: Users, suffix: '+' },
              { value: stats.coffee, label: 'Cups of Coffee', icon: Coffee, suffix: '+' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className={`text-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 hover:scale-105 transition-all duration-500 ${
                    visibleElements.has('stats-section')
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2
            data-animate-id="about-title"
            className={`text-5xl font-bold mb-16 text-center transition-all duration-1000 ${
              visibleElements.has('about-title')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>

          <div
            data-animate-id="about-content"
            className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-1000 ${
              visibleElements.has('about-content')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="grid md:grid-cols-3 gap-12 items-center">
              {/* Image Column with Creative Effects */}
              <div 
                data-animate-id="about-image"
                className={`relative group transition-all duration-1000 ${
                  visibleElements.has('about-image')
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10'
                }`}
              >
                {/* Floating geometric decorations */}
                <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-cyan-400/30 rounded-full animate-spin-slow" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 border-2 border-purple-400/30 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '3s' }} />
                
                {/* Glowing orbs */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />

                {/* Main image container */}
                <div className="relative z-10">
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl animate-gradient-rotate" />
                  
                  {/* Inner border effect */}
                  <div className="absolute inset-0.5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl" />
                  
                  {/* Image with mask */}
                  <div className="relative rounded-2xl overflow-hidden m-1 transform group-hover:scale-105 transition-transform duration-700">
                    <img 
                      src="public/IMG_1322.png"
                      alt="James Magara - Professional Photo"
                      className="w-full h-auto object-cover"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50 flex items-center gap-2 whitespace-nowrap">
                    <Star className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-sm font-bold text-white">Available for Work</span>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="md:col-span-2 space-y-6">
                <div 
                  data-animate-id="about-text-1"
                  className={`transition-all duration-1000 delay-200 ${
                    visibleElements.has('about-text-1')
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-10'
                  }`}
                >
                  <p className="text-lg text-slate-300 leading-relaxed">
                    I'm a passionate computer scientist with expertise in building scalable web applications, 
                    implementing machine learning solutions, and exploring blockchain technology. With a strong 
                    foundation in both frontend and backend development, I thrive on solving complex problems 
                    and creating intuitive user experiences.
                  </p>
                </div>

                <div 
                  data-animate-id="about-text-2"
                  className={`transition-all duration-1000 delay-300 ${
                    visibleElements.has('about-text-2')
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-10'
                  }`}
                >
                  <p className="text-lg text-slate-300 leading-relaxed">
                    When I'm not coding, you'll find me contributing to open-source projects, creating and experimenting on 
                    websites and different technologies such as ML/AI innovations, or simply reading a book. I believe in continuous learning 
                    and staying at the forefront of technological innovation.
                  </p>
                </div>

                {/* Achievement badges */}
                <div 
                  data-animate-id="about-badges"
                  className={`grid md:grid-cols-3 gap-4 pt-8 transition-all duration-1000 delay-400 ${
                    visibleElements.has('about-badges')
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                >
                  {[
                    { icon: CheckCircle, text: 'Clean Code Advocate' },
                    { icon: TrendingUp, text: 'Performance Optimizer' },
                    { icon: Users, text: 'Team Collaborator' }
                  ].map((badge, i) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-cyan-400/50 hover:bg-slate-700/50 transition-all duration-300 group cursor-pointer"
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        <Icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{badge.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - SMOOTH HOVER TRANSITIONS */}
      <section id="skills" className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2
            data-animate-id="skills-title"
            className={`text-4xl md:text-5xl font-bold mb-4 text-center transition-all duration-1000 ${
              visibleElements.has('skills-title')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Technical Arsenal
            </span>
          </h2>
          
          <p 
            data-animate-id="skills-subtitle"
            className={`text-center text-slate-400 text-base mb-12 transition-all duration-1000 ${
              visibleElements.has('skills-subtitle')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Mastering the tools that build the future
          </p>

          {/* 2 Column Compact Stack Layout with Smooth Transitions */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 relative">
            {skills.map((skill, i) => {
              const Icon = skill.icon;
              const isHovered = hoveredSkill === i;
              const stackIndex = Math.floor(i / 2);
              const column = i % 2;
              
              return (
                <div
                  key={i}
                  data-animate-id={`skill-${i}`}
                  onMouseEnter={() => setHoveredSkill(i)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`relative ${
                    visibleElements.has(`skill-${i}`)
                      ? 'opacity-100'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: `${i * 100}ms`,
                    zIndex: isHovered ? 50 : 30 - stackIndex,
                    marginTop: stackIndex > 0 ? '-120px' : '0',
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Compact card with smooth elastic transitions */}
                  <div className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border-2 overflow-hidden ${
                    isHovered 
                      ? 'border-cyan-400/80 shadow-2xl shadow-cyan-500/50' 
                      : 'border-slate-700/30 shadow-lg'
                  }`}
                  style={{
                    transform: isHovered 
                      ? 'translateY(-24px) scale(1.05)' 
                      : `translateY(${stackIndex * 6}px) rotate(${column === 0 ? -0.5 : 0.5}deg)`,
                    transition: isHovered 
                      ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' // Elastic out
                      : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' // Smooth ease-in-out
                  }}>
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 transition-opacity duration-700 ${
                      isHovered ? 'opacity-20' : ''
                    }`} />
                    
                    {/* Glowing corner accent */}
                    <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${skill.color} rounded-full blur-3xl opacity-0 transition-opacity duration-700 ${
                      isHovered ? 'opacity-40' : ''
                    }`} />
                    
                    <div className="relative z-10">
                      {/* Header with icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-br ${skill.color} rounded-xl transition-all duration-700 ${
                          isHovered ? 'scale-110 rotate-12 shadow-lg' : ''
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`px-2.5 py-1 bg-slate-700/50 rounded-full text-xs font-semibold text-cyan-400 border border-cyan-400/30 transition-all duration-500 ${
                          isHovered ? 'scale-105' : ''
                        }`}>
                          {skill.category}
                        </div>
                      </div>

                      {/* Skill name */}
                      <h3 className={`text-lg font-bold mb-3 transition-colors duration-500 ${
                        isHovered ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {skill.name}
                      </h3>

                      {/* Projects count */}
                      <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="text-xs">{skill.projects} projects</span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Proficiency</span>
                          <span className={`text-xs font-bold transition-all duration-700 ${
                            isHovered ? 'text-cyan-400 scale-110' : 'text-slate-500'
                          }`}>
                            {isHovered ? `${skill.level}%` : '???'}
                          </span>
                        </div>
                        <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out relative`}
                            style={{ width: isHovered ? `${skill.level}%` : '0%' }}
                          >
                            {/* Shine effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ${
                              isHovered ? 'translate-x-full' : '-translate-x-full'
                            }`} />
                          </div>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <div className={`mt-3 text-xs text-center text-slate-500 transition-opacity duration-500 ${
                        isHovered ? 'opacity-0' : 'opacity-100'
                      }`}>
                        Hover to reveal
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section - COMPACT CARD DECK */}
      <section id="projects" className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2
            data-animate-id="projects-title"
            className={`text-4xl md:text-5xl font-bold mb-4 text-center transition-all duration-1000 ${
              visibleElements.has('projects-title')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>

          <p 
            data-animate-id="projects-subtitle"
            className={`text-center text-slate-400 text-base mb-8 transition-all duration-1000 ${
              visibleElements.has('projects-subtitle')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Showcasing innovation through code
          </p>

          {/* Compact Card Deck Container */}
          <div className="relative h-[450px] flex items-center justify-center" style={{ perspective: '1500px' }}>
            {projects.map((project, i) => {
              const isActive = i === activeProjectIndex;
              const transform = getProjectTransform(i);
              
              return (
                <div
                  key={i}
                  data-animate-id={`project-${i}`}
                  onClick={() => !isActive && setActiveProjectIndex(i)}
                  className={`absolute w-full max-w-sm transition-all duration-700 ease-out cursor-pointer ${
                    visibleElements.has(`project-${i}`) 
                      ? 'opacity-100' 
                      : 'opacity-0'
                  }`}
                  style={{ 
                    transform: transform.transform,
                    zIndex: transform.zIndex,
                    opacity: transform.opacity,
                    pointerEvents: transform.pointerEvents,
                    transitionDelay: `${i * 50}ms`
                  }}
                >
                  {/* Compact project card */}
                  <div className={`relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                    isActive 
                      ? 'border-cyan-400/80 shadow-2xl shadow-cyan-500/50' 
                      : 'border-slate-700/30 shadow-xl hover:border-cyan-400/50'
                  }`}>
                    {/* Gradient header bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${project.gradient} transition-all duration-500 ${
                      isActive ? 'h-2' : ''
                    }`} />

                    {/* Animated gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 transition-opacity duration-500 ${
                      isActive ? 'opacity-5' : ''
                    }`} />

                    {/* Glowing orb effect */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br ${project.gradient} rounded-full blur-3xl opacity-0 transition-opacity duration-700 ${
                      isActive ? 'opacity-20' : ''
                    }`} />

                    <div className="relative p-6 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={`p-2.5 bg-gradient-to-br ${project.gradient} rounded-xl transition-all duration-500 ${
                          isActive ? 'scale-105 rotate-6 shadow-lg' : ''
                        }`}>
                          <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex gap-2">
                          <button className={`p-1.5 bg-slate-700/50 rounded-full hover:bg-cyan-400/20 transition-all ${
                            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                          }`}>
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                          <button className={`p-1.5 bg-slate-700/50 rounded-full hover:bg-cyan-400/20 transition-all delay-75 ${
                            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                          }`}>
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl font-bold transition-colors duration-300 ${
                        isActive ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-300 leading-relaxed text-sm line-clamp-3">
                        {project.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-700/50">
                        {Object.entries(project.stats).map(([key, value], idx) => (
                          <div 
                            key={key}
                            className={`text-center transition-all duration-300 ${
                              isActive ? 'scale-105' : ''
                            }`}
                            style={{ transitionDelay: `${idx * 50}ms` }}
                          >
                            <div className="text-base font-bold text-cyan-400">{value}</div>
                            <div className="text-xs text-slate-500 uppercase">{key}</div>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="space-y-1.5">
                        {project.features.slice(0, 3).map((feature, j) => (
                          <div
                            key={j}
                            className={`flex items-center gap-2 text-xs text-slate-400 transition-all duration-300 ${
                              isActive ? 'translate-x-1 text-slate-300' : ''
                            }`}
                            style={{ transitionDelay: `${j * 50}ms` }}
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tech.slice(0, 4).map((tech, j) => (
                          <span
                            key={j}
                            className={`px-2.5 py-0.5 bg-slate-700/50 rounded-full text-xs font-medium text-cyan-400 border border-cyan-400/30 transition-all duration-300 ${
                              isActive ? 'scale-105 bg-cyan-400/10' : ''
                            }`}
                            style={{ transitionDelay: `${j * 30}ms` }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handleProjectNavigation('prev')}
              className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-full hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className="flex gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveProjectIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeProjectIndex 
                      ? 'w-6 bg-cyan-400' 
                      : 'w-1.5 bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handleProjectNavigation('next')}
              className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-full hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
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
                  className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-full border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/20 ${
                    visibleElements.has(`contact-${i}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <Icon className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold">{contact.link}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                </a>
              );
            })}
          </div>

          {/* CTA Button */}
          <div 
            data-animate-id="contact-cta"
            className={`mt-12 transition-all duration-1000 ${
              visibleElements.has('contact-cta')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <a
              href="mailto:jm.0.magara@gmail.com"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <Mail className="w-6 h-6" />
              Send Me a Message
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400">
              Designed & Built with <span className="text-cyan-400 animate-pulse">❤</span> by Magara
            </p>
            <div className="flex gap-6">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-4 text-center">
            © 2025 All rights reserved | Built with React & Tailwind CSS
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .animate-gradient-rotate {
          background-size: 400% 400%;
          animation: gradient 8s ease infinite, gradient-rotate 12s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;