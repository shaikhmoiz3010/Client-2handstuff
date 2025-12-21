import React from 'react';
import { Users, Target, Shield, Heart, Sparkles, BookOpen, Globe, Recycle } from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: 'Abdul Moiz Shakeel Shaikh',
      role: 'Founder & CEO',
      description: 'A student who started 2-Hand Stuff to help students save money and reduce waste.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-amber-500 to-amber-400 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6">About 2-Hand Stuff</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Empowering students with affordable study materials through our sustainable 
            peer-to-peer marketplace. Making education accessible for everyone.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200/30 hover:border-amber-300/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mb-6 border border-amber-200/30">
                <Target className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To create a sustainable ecosystem where students can buy and sell 
                their study materials at fair prices, reducing financial burdens and 
                promoting a circular economy in education.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200/30 hover:border-amber-300/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mb-6 border border-amber-200/30">
                <Globe className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become the leading platform for student-to-student commerce, 
                connecting students worldwide and making quality education 
                accessible to everyone through sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">
              The principles that guide everything we do at 2-Hand Stuff
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">



            {/* Sustainability */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200/30 hover:border-amber-300/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center mb-4 border border-green-200/30">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Sustainability</h3>
              <p className="text-gray-600">
                We promote reuse and reduce waste by giving study materials second lives, 
                contributing to environmental sustainability on campus and beyond.
              </p>
            </div>

            {/* Affordability */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200/30 hover:border-amber-300/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center mb-4 border border-amber-200/30">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Affordability</h3>
              <p className="text-gray-600">
                Making education accessible by providing affordable options for every 
                student, regardless of their financial situation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Founder</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individual behind 2-Hand Stuff
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200/30 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <div className="inline-block px-4 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-700 rounded-full text-sm font-medium mb-4 border border-amber-300/30">
                  {member.role}
                </div>
                <p className="text-gray-600">{member.description}</p>
        
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;