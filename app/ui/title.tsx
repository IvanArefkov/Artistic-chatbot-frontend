'use client'
import { useEffect, useRef } from 'react';
import {spectral} from "@/app/fonts"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP)

export default function Title (){
    gsap.registerPlugin(SplitText);
    const titleRef = useRef(null)
    const titleDivRef = useRef<HTMLDivElement>(null)

    useGSAP(()=>{
        const animateTitle = ()=>{
            const split = SplitText.create(titleRef.current,{
        type: 'chars'
        })
        const tl = gsap.timeline()
        .to(split.chars,{
            ease: 'power1.out',
            delay: 2,
            rotateY: 90,
            stagger: 0.03
        })
        .to(split.chars,{
            autoAlpha: 0,
            stagger: 0.02,
            onComplete:()=>{
                if (titleDivRef.current){
                    titleDivRef.current.remove()
                }
            }
        },'<50%')
        }
        if (typeof document !=='undefined'){
            document.fonts.ready.then(animateTitle)
        }
        },{ scope:  titleDivRef })
            
    
    return (
        <div ref={titleDivRef} className="flex h-full w-full justify-center absolute">
            <h1 ref={titleRef} className={`text-4xl ${spectral.className} antialiased self-center title-screen text-white `}>Добро пожаловать в зону тестирования чат-бота с ИИ RAG</h1>
      </div>
    )
}