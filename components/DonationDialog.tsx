'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface DonationDialogProps {
  showButton?: boolean;
}

export default function DonationDialog({ showButton = false }: DonationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only handle automatic popup if showButton is false
    if (!showButton) {
      const hasSeenDialog = localStorage.getItem('hasSeenDonationDialog');
      
      if (!hasSeenDialog) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 5000); // Show after 5 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, [showButton]);

  const handleClose = () => {
    // Only store in localStorage if not in button mode
    if (!showButton) {
      localStorage.setItem('hasSeenDonationDialog', 'true');
    }
    setIsOpen(false);
  };

  const handleDonate = () => {
    // Only store in localStorage if not in button mode
    if (!showButton) {
      localStorage.setItem('hasSeenDonationDialog', 'true');
    }
    setIsOpen(false);
    window.open('https://paypal.me/diogogaspar123', '_blank');
  };

  const dialogContent = (
    <DialogContent 
      className="sm:max-w-md" 
      onInteractOutside={() => {
        if (!showButton) {
          localStorage.setItem('hasSeenDonationDialog', 'true');
        }
        setIsOpen(false);
      }}
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          Support Pathfinder
        </DialogTitle>
        <DialogDescription>
          Thank you for using Pathfinder! If you find this tool helpful, please consider supporting its development.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col space-y-3 py-4">
        <p>
          Your donation helps keep this project alive and enables new features. Even a small contribution makes a big difference!
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <a href="https://paypal.me/diogogaspar123" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">PayPal</a>
          <span>•</span>
          <a href="https://ko-fi.com/shadowoff09" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Ko-Fi</a>
          <span>•</span>
          <a href="https://github.com/sponsors/shadowoff09" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub Sponsors</a>
          <span>•</span>
          <a href="https://thanks.dev/gh/shadowoff09" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">thanks.dev</a>
        </div>
      </div>
      <DialogFooter className="flex sm:justify-between">
        <Button variant="outline" onClick={handleClose}>
          Maybe later
        </Button>
        <Button onClick={handleDonate} className="gap-1">
          <Heart className="h-4 w-4 fill-white" />
          Donate now
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !showButton) {
        localStorage.setItem('hasSeenDonationDialog', 'true');
      }
      setIsOpen(open);
    }}>
      {showButton ? (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-background/70 dark:bg-background/60 backdrop-blur-sm font-onest border border-border/50 gap-1"
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium text-foreground/80">Support</span>
          </Button>
        </DialogTrigger>
      ) : null}
      {dialogContent}
    </Dialog>
  );
} 