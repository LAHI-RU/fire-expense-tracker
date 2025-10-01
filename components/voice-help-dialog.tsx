// Help dialog for voice input features
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Mic, Volume2, MicOff } from "lucide-react";

export function VoiceHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Voice Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Voice Input Guide</DialogTitle>
          <DialogDescription>
            Learn how to use voice input for faster data entry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                Click the microphone button next to any text field to start
                voice input. Your browser will ask for microphone permission the
                first time.
              </p>
              <p className="text-sm">
                <strong>Note:</strong> Voice input works best in Chrome, Edge,
                and Safari browsers.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mic className="h-4 w-4 text-blue-600" />
                  Start Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Click the microphone button to start listening. The button
                  will turn red when active.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MicOff className="h-4 w-4 text-red-600" />
                  Stop Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Click the button again to stop recording. Your speech will be
                  converted to text automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-green-600" />
                  Text Added
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  When text is successfully added, the button will turn green to
                  confirm.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voice Input Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm">For Descriptions:</h4>
                <p className="text-xs text-muted-foreground">
                  Speak clearly: "Fire extinguisher installation at main office
                  building"
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm">For Amounts:</h4>
                <p className="text-xs text-muted-foreground">
                  Say numbers clearly: "One thousand five hundred" or "Fifteen
                  hundred dollars"
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm">For Notes:</h4>
                <p className="text-xs text-muted-foreground">
                  Add context: "Payment received from client via bank transfer
                  on completion"
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm">Best Practices:</h4>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Speak in a quiet environment</li>
                  <li>Speak at normal pace, not too fast or slow</li>
                  <li>Pause briefly between sentences</li>
                  <li>Review and edit the text after voice input</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
