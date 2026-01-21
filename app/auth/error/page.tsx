export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was a problem signing you in with Google.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
