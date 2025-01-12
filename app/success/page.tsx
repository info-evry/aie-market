import { AutoRedirectWithTimer } from "@/app/success/auto-redirect";
import SuccessPayment from "@/public/card-payment.svg";
import Image from "next/image";

export default function Page() {
    return (
        <div className="border-l-border flex justify-center border-t-[1px] bg-white px-4 md:border-t-0 md:py-8 lg:border-l-[1px]">
            <div className="text-center">
                <Image src={SuccessPayment} alt="Success payment illustration" className="h-96" />

                <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Votre paiement a été accepté ! 🎉
                </h1>

                <p className="text-muted-foreground mt-4">
                    Vous allez recevoir un email de confirmation dans quelques instants.
                </p>
                <p className="text-muted-foreground">
                    Nous vous remercions pour la confiance que vous nous accordée
                </p>

                <AutoRedirectWithTimer />
            </div>
        </div>
    );
}
