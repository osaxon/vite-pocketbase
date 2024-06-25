import * as React from "react";
const SvgLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} {...props}>
        <path
            d="M41.625 29 25.25 11.5v27.125Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#3bb3bd",
                fillOpacity: 1,
            }}
        />
        <path
            d="m99.5 46 65.5 70-65.5 38.5m0-108.5L33 116l66.5 38.5m0-108.5v108.5"
            style={{
                fill: "none",
                strokeWidth: 4,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                stroke: "#000",
                strokeOpacity: 1,
                strokeMiterlimit: 4,
            }}
            transform="scale(.25)"
        />
    </svg>
);
export default SvgLogo;
