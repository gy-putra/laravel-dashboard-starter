import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <Head title="Register" />
            
            <div className="w-full max-w-md">
                <Card className="border-border/50 shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </CardTitle>
                        <CardDescription>
                            Enter your details below to create your account
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <Form
                            {...RegisteredUserController.store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                name="name"
                                                placeholder="Enter your full name"
                                                className="h-10"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email@example.com"
                                                className="h-10"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Create a strong password"
                                                className="h-10"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Confirm your password"
                                                className="h-10"
                                            />
                                            <InputError
                                                message={errors.password_confirmation}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-10"
                                            tabIndex={5}
                                            data-test="register-user-button"
                                        >
                                            {processing && (
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Create account
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <TextLink 
                                            href={login()} 
                                            tabIndex={6}
                                            className="font-medium text-primary hover:text-primary/80"
                                        >
                                            Sign in
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
