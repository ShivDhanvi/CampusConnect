import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full">
      <div className="absolute inset-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="School campus background"
          fill
          className="object-cover"
          priority
          data-ai-hint="school campus"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <LoginForm />
      </div>
    </main>
  );
}
