import TestComponent from "@/components/test-components";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
        <div className="min-h-screen p-8">
          <h1 className="text-4xl font-bold mb-8">Tailwind v4 Test</h1>
          <TestComponent />
        </div>
      </div>
  );
}