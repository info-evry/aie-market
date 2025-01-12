import ErrorPayment from "@/public/payment-error.svg";
import Image from "next/image";

export default function Page() {
    return (
        <div className="border-l-border flex justify-center border-t-[1px] bg-white px-4 md:py-8 lg:border-l-[1px]">
            <div className="text-center">
                <Image src={ErrorPayment} alt="Error illustration" className="h-96" />

                <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Oops! Une erreur est survenue
                </h1>

                <p className="text-muted-foreground mt-4">
                    Il semblerait qu&apos;une erreur soit survenue lors du paiement. Veuillez
                    réessayer ou nous contacter : asso@info-evry.fr
                </p>
            </div>
        </div>
    );
}
