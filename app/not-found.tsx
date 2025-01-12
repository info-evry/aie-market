import { Button } from "@radix-ui/themes";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex justify-center">
            <div className="bg-white p-8 text-center">
                <h1 className="text-primary mb-4 text-4xl font-bold">Oups, 404!</h1>
                <p className="text-muted-foreground mb-5 text-lg">
                    On dirait que cette page s'est perdue en cherchant du café...
                </p>
                <p className="text-md text-muted-foreground mb-8 italic">
                    "Pourquoi les programmateurs détestent-ils la nature ? Parce qu'ils n'aiment pas
                    se retrouver devant un bug inattendu !"
                </p>
                <Button asChild variant="outline">
                    <Link href="/">Retourner à l'accueil</Link>
                </Button>
            </div>
        </div>
    );
}
