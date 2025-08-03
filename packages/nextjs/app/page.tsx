"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NextPage } from "next";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <div className="hero min-h-screen bg-gradient-to-br from-primary via-primary to-secondary" id="inicio">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
              Tu futuro financiero
              <br />
              <span className="text-accent">asegurado con crypto</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Convierte tus bolivianos automáticamente a criptomonedas y obtén rendimientos fijos para tu vejez. Sin
              complicaciones, sin conocimientos técnicos.
            </p>
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Link href="/auth/inicio" className="btn btn-accent btn-lg px-8 hover:scale-105 transition-transform">
                🚀 Empezar ahora
              </Link>
              <a
                href="#como-funciona"
                className="btn btn-outline btn-lg px-8 text-white border-white hover:bg-white hover:text-primary"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-base-100" id="beneficios">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-base-content">
            ¿Por qué elegir <span className="text-primary">Sueltito</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔒",
                title: "Renta Fija Garantizada",
                description:
                  "Obtén rendimientos predecibles y estables. Tu dinero crece de forma constante sin sorpresas desagradables.",
              },
              {
                icon: "🚀",
                title: "Sin Conocimientos Técnicos",
                description: "No necesitas saber de crypto. Nosotros nos encargamos de todo el proceso técnico por ti.",
              },
              {
                icon: "💰",
                title: "Desde Bolivianos",
                description:
                  "Convierte directamente desde tu moneda local sin complicaciones ni múltiples intermediarios.",
              },
              {
                icon: "⏰",
                title: "Plazo Fijo Personalizable",
                description: "Elige el tiempo que mejor se adapte a tus metas de ahorro para la vejez.",
              },
              {
                icon: "📱",
                title: "Fácil y Automático",
                description: "Una vez configurado, todo funciona automáticamente. Solo observa cómo crece tu dinero.",
              },
              {
                icon: "🛡️",
                title: "Seguro y Transparente",
                description: "Tecnología blockchain segura con total transparencia en cada transacción.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="card-body text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="card-title text-xl justify-center mb-3">{feature.title}</h3>
                  <p className="text-base-content/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-base-200 to-base-300" id="como-funciona">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-base-content">
            Cómo funciona en <span className="text-primary">3 pasos</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                number: "1",
                title: "Registra tu cuenta",
                description:
                  "Crea tu perfil en Sueltito en menos de 5 minutos. Solo necesitas tu información básica y elegir tu plan de ahorro.",
              },
              {
                number: "2",
                title: "Deposita tus bolivianos",
                description:
                  "Transfiere desde tu cuenta bancaria boliviana. Nosotros convertimos automáticamente a criptomonedas estables.",
              },
              {
                number: "3",
                title: "Observa crecer tu dinero",
                description:
                  "Tu inversión genera rendimientos fijos automáticamente. Al final del plazo, recibes tu capital más las ganancias.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="badge badge-primary badge-lg w-16 h-16 text-2xl font-bold">{step.number}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-base-content">{step.title}</h3>
                <p className="text-base-content/80 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-base-content">
            Números que <span className="text-primary">hablan</span>
          </h2>

          <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full">
            <div className="stat text-center">
              <div className="stat-value text-primary text-4xl lg:text-6xl">8.5%</div>
              <div className="stat-desc text-lg">Rendimiento anual promedio</div>
            </div>

            <div className="stat text-center">
              <div className="stat-value text-secondary text-4xl lg:text-6xl">24/7</div>
              <div className="stat-desc text-lg">Seguridad blockchain</div>
            </div>

            <div className="stat text-center">
              <div className="stat-value text-accent text-4xl lg:text-6xl">0</div>
              <div className="stat-desc text-lg">Conocimiento técnico requerido</div>
            </div>

            <div className="stat text-center">
              <div className="stat-value text-success text-4xl lg:text-6xl">100%</div>
              <div className="stat-desc text-lg">Transparente y auditado</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero py-20 bg-gradient-to-br from-primary to-secondary" id="registro">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Comienza a construir tu futuro financiero <span className="text-accent">hoy</span>
            </h2>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Únete a las personas que ya están asegurando su vejez con Sueltito
            </p>

            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
              <Link className="btn btn-accent btn-lg px-8 hover:scale-105 transition-transform" href="/auth/inicio">
                ✨ Crear mi cuenta gratis
              </Link>
              <a
                href="#contacto"
                className="btn btn-outline btn-lg px-8 text-white border-white hover:bg-white hover:text-primary"
              >
                💬 Hablar con un asesor
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center bg-base-200 text-base-content p-10" id="contacto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          <div className="text-left">
            <h3 className="font-bold text-lg mb-4 text-primary">Sueltito</h3>
            <p className="text-sm">
              La forma más simple de asegurar tu futuro financiero con criptomonedas, sin complicaciones técnicas.
            </p>
          </div>

          <div className="text-left">
            <h3 className="font-bold text-lg mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="link link-hover">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Planes disponibles
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Calculadora de rendimientos
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h3 className="font-bold text-lg mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="link link-hover">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Contactar soporte
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Estado del sistema
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Seguridad
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <div className="space-y-2 text-sm">
              <p>📧 hola@sueltito.bo</p>
              <p>📱 +591 7XX XXX XXX</p>
              <p>📍 La Paz, Bolivia</p>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="text-center">
          <p className="text-sm opacity-70">
            © 2025 Sueltito. Todos los derechos reservados. |
            <a href="#" className="link link-hover ml-1">
              Términos y Condiciones
            </a>{" "}
            |
            <a href="#" className="link link-hover ml-1">
              Política de Privacidad
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const menuLinks: HeaderMenuLink[] = [];

const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

const Header = () => {
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-transparent">
            <Bars3Icon className="h-1/2" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-sm bg-base-100 rounded-box w-52"
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks />
          </ul>
        </details>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Sueltitos</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end grow mr-4">
        <Link className="btn btn-primary" href="/auth/inicio">
          Iniciar
        </Link>
      </div>
    </div>
  );
};
