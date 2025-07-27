"use client";
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md shadow-2xl backdrop-blur-lg bg-card/80">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold font-headline text-primary">CampusConnect</CardTitle>
        <CardDescription>Welcome back! Please sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@example.com" required defaultValue="admin@example.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" type="button" className="p-0 h-auto text-sm text-primary">Forgot password?</Button>
            </div>
            <Input id="password" type="password" required defaultValue="password" />
          </div>
          <Button type="submit" className="w-full font-bold">Sign In</Button>
        </form>
        <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-muted" />
            <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or continue with</span>
            <div className="flex-grow border-t border-muted" />
        </div>
        <Button variant="outline" className="w-full">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center text-center text-sm">
        <p className="text-muted-foreground">Don't have an account? Contact your administrator.</p>
      </CardFooter>
    </Card>
  );
}
