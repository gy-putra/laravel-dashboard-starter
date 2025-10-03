import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <Head title="Log in" />
            
            <div className="w-full max-w-md">
                <Card className="border-border/50 shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription>
                            Enter your email and password to sign in to your account
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-10"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-sm text-primary hover:text-primary/80"
                                                        tabIndex={5}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                className="h-10"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                            />
                                            <Label 
                                                htmlFor="remember" 
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                Remember me for 30 days
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-10"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && (
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Sign in
                                        </Button>
                                    </div>

                                    {status && (
                                        <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            {status}
                                        </div>
                                    )}

                                    <div className="text-center text-sm text-muted-foreground">
                                        Don't have an account?{' '}
                                        <TextLink 
                                            href={register()} 
                                            tabIndex={6}
                                            className="font-medium text-primary hover:text-primary/80"
                                        >
                                            Sign up
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
