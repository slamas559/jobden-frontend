export default function TestComponent() {
  return (
    <div className="p-8 space-y-4">
      {/* Test colors */}
      <div className="bg-primary text-primary-foreground p-4 rounded-lg">
        Primary Color
      </div>
      <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
        Secondary Color
      </div>
      <div className="bg-accent text-accent-foreground p-4 rounded-lg">
        Accent Color
      </div>
      
      {/* Test animations */}
      <div className="animate-fade-in bg-card p-4 rounded-lg border">
        Fade In Animation
      </div>
      <div className="animate-slide-in bg-card p-4 rounded-lg border">
        Slide In Animation
      </div>
      
      {/* Test dark mode */}
      <div className="bg-muted text-muted-foreground p-4 rounded-lg">
        Muted Colors (test dark mode toggle)
      </div>
      
      {/* Test custom utilities */}
      <div className="glass p-4 rounded-lg">
        Glassmorphism Effect
      </div>
      
      <div className="gradient-text text-4xl font-bold">
        Gradient Text
      </div>
    </div>
  );
}