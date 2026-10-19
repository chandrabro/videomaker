"use client";
import dynamic from "next/dynamic";

const Studio = dynamic(() => import("../src/Studio"), { ssr: false });
export default function Page() {
  return <Studio />;
}
