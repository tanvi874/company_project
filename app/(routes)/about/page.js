import Image from 'next/image';
import { CheckCircle2, Lightbulb, ThumbsUp } from 'lucide-react';

const About = () => {
  return (
    <main className="container mb-20">
        <section className="flex pt-16 wrapper min-h-44 flex-col justify-between gap-8 rounded-lg bg-muted p-2 sm:flex-row md:mt-10 md:gap-16">
            <div className="pt-10 sm:pt-5 lg:pt-10 ml-5">
                <h1 className="text-2xl font-bold sm:whitespace-nowrap lg:text-3xl xl:text-4xl">
                Get <span className="text-primary">Everything</span> Your Business Needs
                </h1>
                <p className="mt-4 text-sm lg:mt-6 lg:text-base">
                One place for tracking, understanding, and solving Registrar of Companies compliance
                </p>
            </div>
            <div className="mx-auto w-full max-w-56 md:max-w-60 lg:max-w-80">
                <Image
                alt="Picture of a person making a business decision"
                priority 
                width={400} 
                height={400} 
                className="h-auto mt-10 w-auto object-cover" 
                src="https://www.setindiabiz.com/assets/company-name-search/business-decision.webp"
                />
            </div>
        </section>

        <section className="wrapper mt-5">
            <div className="relative rounded-lg border-l-8 border-l-gray-700 items-start
            bg-background py-5 pl-16 pr-5 font-sans text-sm italic leading-relaxed text-gray-500 shadow before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“'] md:text-base lg:text-lg">
                Ignoring compliance is like driving blind. Stay informed
            </div>
        </section>

        <section className="wrapper mt-10">
            <div>
                <h2 className="md:ext-2xl text-xl font-bold lg:text-3xl">
                How We <span className="text-primary">Started</span>
                </h2>
                <p className="mt-4 flex flex-col gap-4 text-sm md:mt-6 lg:text-base">
                <span>
                    {`Our journey began with a simple yet powerful realization, the world of
                    compliance is complex. We're India's first website dedicated to
                    simplifying RoC Compliance for company owners and compliance
                    professionals. We are here to assist you every step of the way.`}
                </span>
                <span>
                    {`Starting a company takes 15 days with various steps and requirements.
                    Compliance is a crucial part of this journey, from reserving your
                    company's name to filing essential forms.`}
                </span>
                <span>
                    {`As your company grows, new responsibilities arise. Shockingly, around
                    90% of companies are unaware of these crucial compliance requirements
                    due to information gaps. We're here to bridge that gap. Whether you're
                    starting or managing your company, our goal is to make compliance easy
                    and accessible.`}
                </span>
                </p>
            </div>
        </section>

        <div
        data-orientation="horizontal"
        role="none"
        className="my-8 h-[1px] w-full shrink-0 bg-gray-100 md:my-10">
        </div>

        <section className="wrapper">
            <div className="flex flex-col items-center">
                <h3 className="text-xl md:text-2xl lg:text-3xl  font-bold">
                Our Values
                </h3>
                <div className="mt-6 flex flex-col gap-6 md:mt-10 md:flex-row md:gap-8">
                {/* Accuracy Card */}
                <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow">
                    <CheckCircle2 className="text-3xl text-green-500" aria-hidden="true" />
                    <h3 className="mt-3 text-base font-semibold md:text-lg lg:text-xl">
                    Accuracy
                    </h3>
                    <p className="mt-2 text-center text-sm md:text-base">
                    We understand that accuracy is at the core of trust. We keep our
                    content up-to-date to reflect any changes in compliance
                    regulations, forms, or requirements.
                    </p>
                </div>

                {/* Simplicity Card */}
                <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow">
                    <Lightbulb className="text-3xl text-yellow-500" aria-hidden="true" />
                    <h3 className="mt-3 text-base font-semibold md:text-lg lg:text-xl">
                    Simplicity
                    </h3>
                    <p className="mt-2 text-center text-sm md:text-base">
                    Compliance should be accessible to everyone, regardless of their
                    level of expertise. Our interface is intuitive, with plain and
                    clear language, avoiding unnecessary technical terms.
                    </p>
                </div>

                {/* Reliability Card */}
                <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow">
                    <ThumbsUp className="text-3xl text-blue-500" aria-hidden="true" />
                    <h3 className="mt-3 text-base font-semibold md:text-lg lg:text-xl">
                    Reliability
                    </h3>
                    <p className="mt-2 text-center text-sm md:text-base">
                    We are reliable partners in your compliance journey. We keep you
                    informed about changes and updates, and we are here to assist you
                    promptly and effectively.
                    </p>
                </div>
                </div>
            </div>
        </section>
    </main>  
  );
};

export default About;