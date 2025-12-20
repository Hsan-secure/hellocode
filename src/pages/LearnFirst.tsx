import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Play, Clock, BookOpen } from 'lucide-react';

interface VideoResource {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  url: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface LanguageResources {
  name: string;
  color: string;
  icon: string;
  description: string;
  videos: VideoResource[];
}

const learningResources: Record<string, LanguageResources> = {
  html: {
    name: 'HTML',
    color: 'from-orange-500 to-red-500',
    icon: '📄',
    description: 'Learn the building blocks of web pages',
    videos: [
      { id: 'html-1', title: 'HTML Full Course for Beginners', channel: 'freeCodeCamp', duration: '4:10:00', thumbnail: 'https://i.ytimg.com/vi/pQN-pnXPaVg/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', level: 'beginner' },
      { id: 'html-2', title: 'HTML Tutorial for Beginners', channel: 'Programming with Mosh', duration: '1:09:32', thumbnail: 'https://i.ytimg.com/vi/qz0aGYrrlhU/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU', level: 'beginner' },
      { id: 'html-3', title: 'HTML Crash Course For Absolute Beginners', channel: 'Traversy Media', duration: '1:00:41', thumbnail: 'https://i.ytimg.com/vi/UB1O30fR-EE/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', level: 'beginner' },
      { id: 'html-4', title: 'Learn HTML5 and CSS3 From Scratch', channel: 'Traversy Media', duration: '2:11:00', thumbnail: 'https://i.ytimg.com/vi/mU6anWqZJcc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc', level: 'intermediate' },
    ],
  },
  css: {
    name: 'CSS',
    color: 'from-blue-500 to-cyan-500',
    icon: '🎨',
    description: 'Style and design beautiful web pages',
    videos: [
      { id: 'css-1', title: 'CSS Full Course for Beginners', channel: 'freeCodeCamp', duration: '11:08:00', thumbnail: 'https://i.ytimg.com/vi/OXGznpKZ_sA/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=OXGznpKZ_sA', level: 'beginner' },
      { id: 'css-2', title: 'CSS Tutorial - Full Course for Beginners', channel: 'Dave Gray', duration: '9:19:43', thumbnail: 'https://i.ytimg.com/vi/n4R2E7O-Ngo/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=n4R2E7O-Ngo', level: 'beginner' },
      { id: 'css-3', title: 'Flexbox CSS In 20 Minutes', channel: 'Traversy Media', duration: '19:59', thumbnail: 'https://i.ytimg.com/vi/JJSoEo8JSnc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=JJSoEo8JSnc', level: 'intermediate' },
      { id: 'css-4', title: 'CSS Grid Layout Crash Course', channel: 'Traversy Media', duration: '27:55', thumbnail: 'https://i.ytimg.com/vi/jV8B24rSN5o/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=jV8B24rSN5o', level: 'intermediate' },
    ],
  },
  javascript: {
    name: 'JavaScript',
    color: 'from-yellow-500 to-amber-500',
    icon: '⚡',
    description: 'Add interactivity to your websites',
    videos: [
      { id: 'js-1', title: 'JavaScript Full Course for Beginners', channel: 'freeCodeCamp', duration: '8:00:00', thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', level: 'beginner' },
      { id: 'js-2', title: 'JavaScript Tutorial for Beginners', channel: 'Programming with Mosh', duration: '48:17', thumbnail: 'https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', level: 'beginner' },
      { id: 'js-3', title: 'JavaScript DOM Manipulation', channel: 'Traversy Media', duration: '40:33', thumbnail: 'https://i.ytimg.com/vi/y17RuWkWdn8/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=y17RuWkWdn8', level: 'intermediate' },
      { id: 'js-4', title: 'Async JavaScript Crash Course', channel: 'Traversy Media', duration: '24:31', thumbnail: 'https://i.ytimg.com/vi/PoRJizFvM7s/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=PoRJizFvM7s', level: 'advanced' },
    ],
  },
  ds: {
    name: 'Data Structures',
    color: 'from-green-500 to-emerald-500',
    icon: '🌳',
    description: 'Master essential data structures',
    videos: [
      { id: 'ds-1', title: 'Data Structures Easy to Advanced', channel: 'freeCodeCamp', duration: '8:03:00', thumbnail: 'https://i.ytimg.com/vi/RBSGKlAvoiM/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', level: 'beginner' },
      { id: 'ds-2', title: 'Data Structures and Algorithms in JavaScript', channel: 'freeCodeCamp', duration: '1:53:22', thumbnail: 'https://i.ytimg.com/vi/t2CEgPsws3U/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=t2CEgPsws3U', level: 'intermediate' },
      { id: 'ds-3', title: 'Linked Lists for Technical Interviews', channel: 'freeCodeCamp', duration: '1:26:09', thumbnail: 'https://i.ytimg.com/vi/Hj_rA0dhr2I/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=Hj_rA0dhr2I', level: 'intermediate' },
      { id: 'ds-4', title: 'Binary Tree Algorithms for Technical Interviews', channel: 'freeCodeCamp', duration: '2:21:08', thumbnail: 'https://i.ytimg.com/vi/fAAZixBzIAI/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=fAAZixBzIAI', level: 'advanced' },
    ],
  },
  dbms: {
    name: 'DBMS',
    color: 'from-purple-500 to-violet-500',
    icon: '🗄️',
    description: 'Learn database management systems',
    videos: [
      { id: 'dbms-1', title: 'SQL Tutorial - Full Database Course', channel: 'freeCodeCamp', duration: '4:20:37', thumbnail: 'https://i.ytimg.com/vi/HXV3zeQKqGY/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', level: 'beginner' },
      { id: 'dbms-2', title: 'MySQL Tutorial for Beginners', channel: 'Programming with Mosh', duration: '3:10:20', thumbnail: 'https://i.ytimg.com/vi/7S_tz1z_5bA/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', level: 'beginner' },
      { id: 'dbms-3', title: 'Database Design Course', channel: 'freeCodeCamp', duration: '8:04:16', thumbnail: 'https://i.ytimg.com/vi/ztHopE5Wnpc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc', level: 'intermediate' },
      { id: 'dbms-4', title: 'PostgreSQL Tutorial Full Course', channel: 'freeCodeCamp', duration: '4:19:21', thumbnail: 'https://i.ytimg.com/vi/qw--VYLpxG4/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', level: 'intermediate' },
    ],
  },
  python: {
    name: 'Python',
    color: 'from-blue-600 to-indigo-600',
    icon: '🐍',
    description: 'Learn Python programming from scratch',
    videos: [
      { id: 'py-1', title: 'Python Full Course for Beginners', channel: 'freeCodeCamp', duration: '12:00:00', thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', level: 'beginner' },
      { id: 'py-2', title: 'Python Tutorial for Beginners', channel: 'Programming with Mosh', duration: '6:14:07', thumbnail: 'https://i.ytimg.com/vi/_uQrJ0TkZlc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', level: 'beginner' },
      { id: 'py-3', title: 'Python OOP Tutorial', channel: 'Corey Schafer', duration: '1:09:32', thumbnail: 'https://i.ytimg.com/vi/ZDa-Z5JzLYM/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM', level: 'intermediate' },
      { id: 'py-4', title: 'Python Projects for Beginners', channel: 'freeCodeCamp', duration: '3:38:19', thumbnail: 'https://i.ytimg.com/vi/8ext9G7xspg/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=8ext9G7xspg', level: 'intermediate' },
    ],
  },
};

const VideoCard = ({ video, color }: { video: VideoResource; color: string }) => {
  return (
    <Card 
      variant="gaming" 
      className="group overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      onClick={() => window.open(video.url, '_blank')}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360/1a1a2e/00ffff?text=Video+Thumbnail';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-xl`}>
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        <Badge 
          variant="level" 
          className="absolute top-3 right-3 capitalize"
        >
          {video.level}
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{video.channel}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {video.duration}
          </div>
        </div>
      </div>
    </Card>
  );
};

const LearnFirst = () => {
  const [activeTab, setActiveTab] = useState('html');
  const currentResource = learningResources[activeTab];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge variant="xp" className="mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn Before You Play
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-gradient-primary">LearnFirst</span> Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch these curated YouTube tutorials before attempting the quizzes. 
            Master the fundamentals and ace your coding challenges!
          </p>
        </div>

        {/* Language Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent h-auto p-0">
            {Object.entries(learningResources).map(([key, resource]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card/50 data-[state=active]:bg-gradient-to-br data-[state=active]:${resource.color} data-[state=active]:border-transparent data-[state=active]:text-white transition-all`}
              >
                <span className="text-2xl">{resource.icon}</span>
                <span className="font-medium text-sm">{resource.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(learningResources).map(([key, resource]) => (
            <TabsContent key={key} value={key} className="animate-fade-in">
              {/* Language Header */}
              <Card variant="glow" className="p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-3xl`}>
                    {resource.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {resource.name} Tutorials
                    </h2>
                    <p className="text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
              </Card>

              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resource.videos.map((video) => (
                  <VideoCard key={video.id} video={video} color={resource.color} />
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => window.location.href = '/levels'}
                >
                  Start {resource.name} Quiz
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default LearnFirst;