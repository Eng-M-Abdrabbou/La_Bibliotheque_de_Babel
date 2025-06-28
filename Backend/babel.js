// =========================================================================
// == THE UNIFIED babel.js - LCG (Full Glory & Authentic Dimensions)    ==
// =========================================================================

// --- LCG ("Full Glory" Random Walk) Implementation ---
const lcg = (() => {
    const M = BigInt("340282366920938463463374607431768211297");
    const A = BigInt("2862933555777941757");
    const C = BigInt("3037000493");
    
    const CHAR_SET = "abcdefghijklmnopqrstuvwxyz, .";
    const CHAR_COUNT = BigInt(CHAR_SET.length);

    const CHARS_PER_LINE = 80;
    const LINES_PER_PAGE = 40;
    const CHARS_PER_PAGE = CHARS_PER_LINE * LINES_PER_PAGE; // 3200
    const PAGES_PER_BOOK = 410; // The canonical number of pages
    const SHELVES_PER_WALL = 5;
    const WALLS_PER_HEX = 4;
    const BOOKS_PER_SHELF = 32;

    const FACTOR_PAGE = 1n;
    const FACTOR_BOOK = FACTOR_PAGE * BigInt(PAGES_PER_BOOK);
    const FACTOR_SHELF = FACTOR_BOOK * BigInt(BOOKS_PER_SHELF);
    const FACTOR_WALL = FACTOR_SHELF * BigInt(SHELVES_PER_WALL);
    const FACTOR_HEX = FACTOR_WALL * BigInt(WALLS_PER_HEX);

    function modInverse(a, m) { let m0=m,y=0n,x=1n;if(m===1n)return 0n;while(a>1n){let q=a/m;[a,m]=[m,a%m];[x,y]=[y,x-q*y];}if(x<0n)x+=m0;return x; }
    const A_INV = modInverse(A, M);
    const lcg_forward = (s) => (A*s+C)%M;
    const lcg_backward = (s) => (((s-C)%M+M)%M*A_INV)%M;
    const stateToChar = (s) => CHAR_SET[Number(s%CHAR_COUNT)];

    function addressToState(addr) {
        const page = BigInt(addr.page) - 1n;
        const book = BigInt(addr.book) - 1n;
        const shelf = BigInt(addr.shelf) - 1n;
        const wall = BigInt(addr.wall) - 1n;
        const hex = BigInt(addr.hex.replace(/[^0-9]/g, '') || '0');
        let state = (hex * FACTOR_HEX) + (wall * FACTOR_WALL) + (shelf * FACTOR_SHELF) + (book * FACTOR_BOOK) + (page * FACTOR_PAGE);
        return state % M;
    }

    function stateToAddress(state) {
        let addr={};addr.hex=String(state/FACTOR_HEX);state%=FACTOR_HEX;addr.wall=Number(state/FACTOR_WALL)+1;state%=FACTOR_WALL;addr.shelf=Number(state/FACTOR_SHELF)+1;state%=FACTOR_SHELF;addr.book=Number(state/FACTOR_BOOK)+1;state%=FACTOR_BOOK;addr.page=Number(state/FACTOR_PAGE)+1;return addr;
    }

    function getPageContent(address) {
        let s=addressToState(address),c='';
        // This loop now runs 3200 times, making page generation slower but authentic.
        for(let i=0;i<CHARS_PER_PAGE;i++){c+=stateToChar(s);s=lcg_forward(s);}return c;
    }

    function searchText(query) {
        const seq=query.split('').map(c=>BigInt(CHAR_SET.indexOf(c))), qLen=seq.length; if(qLen===0)return null; const lci=seq[qLen-1];
        const MAX_SEARCH_ITERATIONS = 50000000n; 
        for(let i=0n;i<MAX_SEARCH_ITERATIONS;i++){let cfls=lci+(i*CHAR_COUNT);if(cfls>=M)break;let cs=cfls,v=true;for(let j=qLen-2;j>=0;j--){const ps=lcg_backward(cs);if((ps%CHAR_COUNT)!==seq[j]){v=false;break;}cs=ps;}if(v)return stateToAddress(cs);}return null;
    }
    
    return { getPageContent, searchText };
})();


// --- Perfect (Base Conversion) Implementation ---
// This part remains unchanged, at 300 characters, providing the perfect contrast.
const perfect = (() => {
    const CHAR_SET = "abcdefghijklmnopqrstuvwxyz, .";
    const BASE = BigInt(CHAR_SET.length);
    const PAGE_LENGTH = 300;
    function addressToContent(pageId) {
        if(typeof pageId!=='bigint')pageId=BigInt(pageId);let ca=[];for(let i=0;i<PAGE_LENGTH;i++){ca.push(CHAR_SET[Number(pageId%BASE)]);pageId/=BASE;}return ca.reverse().join('');
    }
    function contentToAddress(content) {
        let pId=0n;for(let i=0;i<content.length;i++){const c=content[i],ci=BigInt(CHAR_SET.indexOf(c));if(ci===-1n)continue;pId=pId*BASE+ci;}return pId;
    }
    function getPageContent(address) { return addressToContent(address.id); }
    function searchText(query) {
        if(!query||query.length>PAGE_LENGTH)return null;const pad=query.padEnd(PAGE_LENGTH,'a'),pId=contentToAddress(pad);return{id:String(pId)};
    }
    return { getPageContent, searchText };
})();

module.exports = { lcg, perfect };