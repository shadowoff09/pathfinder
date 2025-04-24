import { CoordinatesProvider } from "@/hooks/useCoordinates";

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <div>
          <CoordinatesProvider>
            {children}
          </CoordinatesProvider>
      </div>

  );
}
