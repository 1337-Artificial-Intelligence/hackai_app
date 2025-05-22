import * as React from "react";
import { Eye, EyeOff, ArrowLeftIcon } from "lucide-react";
import { BackgroundBeams } from "../components/ui/background-beams";
import { Button } from "../components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";

export default function CardWithForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        // If there's an error parsing user data, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      // Redirect based on role
      if (data.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black">
      <div className="w-screen min-h-screen text-white md:px-6 px-3 flex justify-center items-center bg-black">
        <nav className="bg-black fixed top-0 w-full p-3 flex justify-between z-10 items-center">
          <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
            <img src="/assets/logo_l.png" className="md:w-48 w-36" alt="" />
            <Link
              to="/"
              className="inline-flex gap-2 md:h-12 h-9 font-extrabold animate-shimmer items-center hover:underline cursor-pointer justify-center rounded-md"
            >
              <ArrowLeftIcon size={18} className="text-xl" />
              Back to home
            </Link>
          </div>
        </nav>
        <Card className="dark relative z-10 sm:w-[350px] w-full">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Login to your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="Login">Name</Label>
                  <Input 
                    id="Login" 
                    placeholder="Your Login" 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 relative">
                  <Label htmlFor="Password">Password</Label>
                  <Input
                    id="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <div
                    variant="ghost"
                    size="icon"
                    className="absolute cursor-pointer right-0 top-[25%] h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-start gap-2">
            <div
              onClick={handleLogin}
              className="hover:text-black hover:bg-white font-bold cursor-pointer"
            >
              {isLoading ? "Logging in..." : "Login"}
            </div>
          </CardFooter>
        </Card>
      </div>
      <BackgroundBeams />
    </div>
  );
}
