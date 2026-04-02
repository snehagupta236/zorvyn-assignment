import { useState, useMemo, useEffect, useRef } from "react";


const T = {
  bg0:"#080b10", bg1:"#0f1219", bg2:"#161c27", bg3:"#1c2333",
  border:"#ffffff12", borderHover:"#ffffff22",
  text1:"#eef0f6", text2:"#7d8699", text3:"#3e4757",
  green:"#1ed87a", greenGlow:"#1ed87a28",
  red:"#ff4f63",   redGlow:"#ff4f6328",
  blue:"#4e9eff",  blueGlow:"#4e9eff28",
  amber:"#f5a623", amberGlow:"#f5a62328",
  purple:"#9b8cff",teal:"#22d3c8", pink:"#f472b6",
};

const CAT_COLORS = {
  Food:"#f5a623",Transport:"#4e9eff",Shopping:"#9b8cff",
  Health:"#1ed87a",Entertainment:"#f472b6",Utilities:"#22d3c8",
  Salary:"#1ed87a",Freelance:"#4e9eff",Investment:"#9b8cff",
  Rent:"#ff4f63",Education:"#f5a623",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CAT_EMOJI = {
  Salary:"💼",Food:"🍔",Transport:"🚌",Shopping:"🛍️",Health:"❤️",
  Entertainment:"🎬",Freelance:"💻",Investment:"📈",Rent:"🏠",
  Education:"📚",Utilities:"⚡",
};

const INIT = [
  {id:1, date:"2024-01-05",amount:4500,category:"Salary",      type:"income", note:"Monthly salary"},
  {id:2, date:"2024-01-07",amount:1200,category:"Rent",        type:"expense",note:"Apartment rent"},
  {id:3, date:"2024-01-10",amount:320, category:"Food",        type:"expense",note:"Grocery shopping"},
  {id:4, date:"2024-01-12",amount:850, category:"Freelance",   type:"income", note:"Design project"},
  {id:5, date:"2024-01-15",amount:180, category:"Transport",   type:"expense",note:"Monthly pass"},
  {id:6, date:"2024-01-18",amount:450, category:"Shopping",    type:"expense",note:"Clothes"},
  {id:7, date:"2024-01-20",amount:90,  category:"Entertainment",type:"expense",note:"Netflix + Spotify"},
  {id:8, date:"2024-01-22",amount:200, category:"Health",      type:"expense",note:"Doctor visit"},
  {id:9, date:"2024-01-25",amount:500, category:"Investment",  type:"income", note:"Dividends"},
  {id:10,date:"2024-01-28",amount:130, category:"Utilities",   type:"expense",note:"Electricity"},
  {id:11,date:"2024-02-05",amount:4500,category:"Salary",      type:"income", note:"Monthly salary"},
  {id:12,date:"2024-02-07",amount:1200,category:"Rent",        type:"expense",note:"Apartment rent"},
  {id:13,date:"2024-02-09",amount:280, category:"Food",        type:"expense",note:"Restaurants"},
  {id:14,date:"2024-02-14",amount:220, category:"Shopping",    type:"expense",note:"Valentine gifts"},
  {id:15,date:"2024-02-18",amount:1200,category:"Freelance",   type:"income", note:"Web dev project"},
  {id:16,date:"2024-02-20",amount:95,  category:"Entertainment",type:"expense",note:"Cinema"},
  {id:17,date:"2024-02-22",amount:160, category:"Transport",   type:"expense",note:"Cab rides"},
  {id:18,date:"2024-02-25",amount:145, category:"Utilities",   type:"expense",note:"Internet + gas"},
  {id:19,date:"2024-03-05",amount:4500,category:"Salary",      type:"income", note:"Monthly salary"},
  {id:20,date:"2024-03-07",amount:1200,category:"Rent",        type:"expense",note:"Apartment rent"},
  {id:21,date:"2024-03-10",amount:380, category:"Food",        type:"expense",note:"Groceries + dining"},
  {id:22,date:"2024-03-15",amount:300, category:"Education",   type:"expense",note:"Online course"},
  {id:23,date:"2024-03-18",amount:600, category:"Investment",  type:"income", note:"Stock gains"},
  {id:24,date:"2024-03-20",amount:250, category:"Shopping",    type:"expense",note:"Electronics"},
  {id:25,date:"2024-03-24",amount:75,  category:"Health",      type:"expense",note:"Gym"},
  {id:26,date:"2024-03-27",amount:120, category:"Entertainment",type:"expense",note:"Concert"},
];

const fmt = n => "₹" + Math.abs(n).toLocaleString("en-IN");

/* ── Animated number ── */
function AnimNum({ to, prefix="₹", isRaw=false }) {
  const [cur, setCur] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    const from = ref.current, dur = 700, t0 = performance.now();
    const tick = ts => {
      const p = Math.min((ts-t0)/dur, 1), e = 1-Math.pow(1-p,3);
      const v = Math.round(from + (to-from)*e);
      setCur(v); if(p<1) requestAnimationFrame(tick); else ref.current=to;
    };
    requestAnimationFrame(tick);
  }, [to]);
  if(isRaw) return <span>{cur}</span>;
  return <span>{prefix}{Math.abs(cur).toLocaleString("en-IN")}</span>;
}

/* ── Spark ── */
function Spark({ data, color, w=72, h=28 }) {
  if(!data||data.length<2) return null;
  const mn=Math.min(...data), mx=Math.max(...data,mn+1);
  const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/(mx-mn))*h*0.85}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:w,height:h}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.12"/>
    </svg>
  );
}

/* ── Bar chart ── */
function BarChart({ monthlyData }) {
  const max = Math.max(...monthlyData.flatMap(m=>[m.income,m.expense]),1);
  const W=580,H=150,PL=38,B=12,G=3,slot=(W-PL)/monthlyData.length;
  return (
    <svg viewBox={`0 0 ${W} ${H+24}`} style={{width:"100%"}} preserveAspectRatio="xMidYMid meet">
      {[0,.5,1].map((t,i)=>{
        const y=H-t*H+2;
        return <g key={i}><line x1={PL} x2={W-4} y1={y} y2={y} stroke={T.border} strokeWidth="0.5"/><text x={PL-5} y={y+3} fontSize="8" fill={T.text3} textAnchor="end">{fmt(max*t)}</text></g>;
      })}
      {monthlyData.map((m,i)=>{
        const cx=PL+slot*i+slot/2;
        const iH=(m.income/max)*H, eH=(m.expense/max)*H;
        return (
          <g key={i}>
            <rect x={cx-B-G} y={H-iH+2} width={B} height={Math.max(iH,1)} fill={T.green} rx="2" fillOpacity="0.9"/>
            <rect x={cx+G} y={H-eH+2} width={B} height={Math.max(eH,1)} fill={T.red} rx="2" fillOpacity="0.9"/>
            <text x={cx} y={H+16} fontSize="9" fill={T.text2} textAnchor="middle">{m.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Area chart ── */
function AreaChart({ balanceTrend }) {
  if(balanceTrend.length<2) return null;
  const vals=balanceTrend.map(d=>d.balance);
  const mn=Math.min(...vals), mx=Math.max(...vals,mn+1);
  const W=580,H=120,PL=40;
  const sx=i=>PL+(i/(vals.length-1))*(W-PL-8);
  const sy=v=>H-((v-mn)/(mx-mn))*(H-22)-4;
  const pts=balanceTrend.map((d,i)=>[sx(i),sy(d.balance)]);
  const line=pts.map(([x,y],i)=>`${i?"L":"M"}${x},${y}`).join(" ");
  const area=`${line} L${pts[pts.length-1][0]},${H} L${pts[0][0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H+22}`} style={{width:"100%"}} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.blue} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={T.blue} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[mn,(mn+mx)/2,mx].map((v,i)=>{
        const y=sy(v);
        return <g key={i}><line x1={PL} x2={W-8} y1={y} y2={y} stroke={T.border} strokeWidth="0.5"/><text x={PL-4} y={y+3} fontSize="8" fill={T.text3} textAnchor="end">{fmt(v)}</text></g>;
      })}
      <path d={area} fill="url(#ag)"/>
      <path d={line} fill="none" stroke={T.blue} strokeWidth="2" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill={T.bg1} stroke={T.blue} strokeWidth="2"/>
          <text x={x} y={H+18} fontSize="9" fill={T.text2} textAnchor="middle">{balanceTrend[i].label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Donut ── */
function Donut({ data }) {
  const total=data.reduce((s,d)=>s+d.value,0)||1;
  const SZ=160,R=60,r=34,CX=80,CY=80;
  let cum=0;
  const slices=data.slice(0,7).map(d=>{
    const p=d.value/total,a0=cum*2*Math.PI-Math.PI/2;
    cum+=p;
    const a1=cum*2*Math.PI-Math.PI/2;
    const x0=CX+R*Math.cos(a0),y0=CY+R*Math.sin(a0);
    const x1=CX+R*Math.cos(a1),y1=CY+R*Math.sin(a1);
    const xi0=CX+r*Math.cos(a0),yi0=CY+r*Math.sin(a0);
    const xi1=CX+r*Math.cos(a1),yi1=CY+r*Math.sin(a1);
    const lg=p>0.5?1:0;
    return {...d,p,path:`M${x0},${y0}A${R},${R},0,${lg},1,${x1},${y1}L${xi1},${yi1}A${r},${r},0,${lg},0,${xi0},${yi0}Z`};
  });
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <svg viewBox={`0 0 ${SZ} ${SZ}`} style={{width:SZ,height:SZ,flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} stroke={T.bg1} strokeWidth="2.5"/>)}
        <text x={CX} y={CY-6} textAnchor="middle" fontSize="9" fill={T.text2}>total spent</text>
        <text x={CX} y={CY+10} textAnchor="middle" fontSize="13" fill={T.text1} fontWeight="700">{fmt(total)}</text>
      </svg>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,minWidth:120}}>
        {slices.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
            <span style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
            <span style={{color:T.text2,flex:1}}>{d.label}</span>
            <span style={{color:T.text1,fontWeight:600}}>{Math.round(d.p*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── HBar ── */
function HBar({ data, total }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:11}}>
      {data.map((d,i)=>{
        const pct=total>0?Math.round((d.value/total)*100):0;
        return (
          <div key={i}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
              <span style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:8,height:8,borderRadius:2,background:d.color}}/>
                <span style={{color:T.text2}}>{d.label}</span>
              </span>
              <span style={{color:T.text1,fontWeight:600}}>{fmt(d.value)}<span style={{color:T.text3,fontWeight:400}}> · {pct}%</span></span>
            </div>
            <div style={{height:5,background:T.bg3,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:pct+"%",background:d.color,borderRadius:4,transition:"width 0.7s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Card ── */
const Card=({children,style})=>(
  <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 22px",...style}}>
    {children}
  </div>
);

const SecTitle=({children})=>(
  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:T.text3,textTransform:"uppercase",marginBottom:14}}>{children}</div>
);

/* ── Modal ── */
function Modal({title,onClose,children}){
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:T.bg2,border:`1px solid ${T.borderHover}`,borderRadius:20,padding:"26px 28px",width:"100%",maxWidth:440}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontWeight:700,fontSize:16,color:T.text1}}>{title}</span>
          <button onClick={onClose} style={{background:T.bg3,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",color:T.text2,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const iStyle={width:"100%",padding:"9px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bg3,color:T.text1,fontSize:13,boxSizing:"border-box",outline:"none"};

function TxnForm({onSave,onClose,initial}){
  const cats=Object.keys(CAT_COLORS);
  const[form,setForm]=useState(initial||{date:new Date().toISOString().slice(0,10),amount:"",category:"Food",type:"expense",note:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {[["Date","date","date"],["Amount (₹)","amount","number"],["Note","note","text"]].map(([l,k,t])=>(
        <div key={k}>
          <label style={{fontSize:11,color:T.text3,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</label>
          <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={iStyle}/>
        </div>
      ))}
      <div>
        <label style={{fontSize:11,color:T.text3,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"}}>Category</label>
        <select value={form.category} onChange={e=>set("category",e.target.value)} style={{...iStyle,cursor:"pointer"}}>
          {cats.map(c=><option key={c} style={{background:T.bg2}}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={{fontSize:11,color:T.text3,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>Type</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {["income","expense"].map(t=>(
            <button key={t} onClick={()=>set("type",t)}
              style={{padding:"10px",borderRadius:10,border:`1px solid ${form.type===t?(t==="income"?T.green:T.red):T.border}`,background:form.type===t?(t==="income"?T.greenGlow:T.redGlow):"transparent",cursor:"pointer",fontWeight:form.type===t?700:400,color:form.type===t?(t==="income"?T.green:T.red):T.text2,fontSize:13,transition:"all 0.15s"}}>
              {t==="income"?"↑ Income":"↓ Expense"}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:6}}>
        <button onClick={onClose} style={{padding:"11px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",cursor:"pointer",color:T.text2,fontSize:13}}>Cancel</button>
        <button onClick={()=>{if(form.amount&&form.date){onSave({...form,amount:parseFloat(form.amount),id:initial?.id||Date.now()});onClose();}}}
          style={{padding:"11px",borderRadius:10,border:"none",background:T.blue,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700}}>
          {initial?"Save Changes":"Add Transaction"}
        </button>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
export default function App() {
  const[role,setRole]=useState("admin");
  const[tab,setTab]=useState("overview");
  const[transactions,setTransactions]=useState(()=>{
    try{const s=localStorage.getItem("fin3");return s?JSON.parse(s):INIT;}catch{return INIT;}
  });
  const[search,setSearch]=useState("");
  const[fType,setFType]=useState("all");
  const[fCat,setFCat]=useState("all");
  const[sortKey,setSortKey]=useState("date");
  const[sortDir,setSortDir]=useState("desc");
  const[modal,setModal]=useState(false);
  const[editTxn,setEditTxn]=useState(null);

  useEffect(()=>{try{localStorage.setItem("fin3",JSON.stringify(transactions));}catch{}},[transactions]);

  const totalIncome =useMemo(()=>transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[transactions]);
  const totalExpense=useMemo(()=>transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[transactions]);
  const balance=totalIncome-totalExpense;

  const monthlyData=useMemo(()=>{
    const m={};
    transactions.forEach(t=>{
      const d=new Date(t.date),k=`${d.getFullYear()}-${d.getMonth()}`;
      if(!m[k]) m[k]={income:0,expense:0,label:MONTHS[d.getMonth()],year:d.getFullYear(),month:d.getMonth()};
      m[k][t.type]+=t.amount;
    });
    return Object.values(m).sort((a,b)=>a.year!==b.year?a.year-b.year:a.month-b.month);
  },[transactions]);

  const balanceTrend=useMemo(()=>{let r=0;return monthlyData.map(m=>{r+=m.income-m.expense;return{label:m.label,balance:r};});},[monthlyData]);

  const spendByCat=useMemo(()=>{
    const m={};
    transactions.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value,color:CAT_COLORS[label]||T.text3}));
  },[transactions]);

  const allCats=useMemo(()=>[...new Set(transactions.map(t=>t.category))],[transactions]);

  const filtered=useMemo(()=>{
    let list=[...transactions];
    if(fType!=="all") list=list.filter(t=>t.type===fType);
    if(fCat!=="all") list=list.filter(t=>t.category===fCat);
    if(search) list=list.filter(t=>(t.note+t.category).toLowerCase().includes(search.toLowerCase()));
    list.sort((a,b)=>{let va=a[sortKey],vb=b[sortKey];if(sortKey==="amount"){va=+va;vb=+vb;}return sortDir==="asc"?(va<vb?-1:1):(va>vb?-1:1);});
    return list;
  },[transactions,fType,fCat,search,sortKey,sortDir]);

  const topCat=spendByCat[0];
  const lastM=monthlyData[monthlyData.length-1];
  const prevM=monthlyData[monthlyData.length-2];
  const spendDelta=prevM?((lastM?.expense-prevM.expense)/prevM.expense*100).toFixed(1):null;
  const saveRate=totalIncome>0?Math.round((balance/totalIncome)*100):0;

  const handleSort=k=>{if(sortKey===k)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortKey(k);setSortDir("desc");}};
  const addTxn=t=>setTransactions(p=>[...p,t]);
  const editSave=t=>setTransactions(p=>p.map(x=>x.id===t.id?t:x));
  const delTxn=id=>setTransactions(p=>p.filter(x=>x.id!==id));
  const exportCSV=()=>{
    const csv=[["Date","Amount","Category","Type","Note"],...transactions.map(t=>[t.date,t.amount,t.category,t.type,t.note])].map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="transactions.csv";a.click();
  };

  const NAV=[
    {id:"overview",label:"Overview",
     icon:<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><rect x="0" y="9" width="4" height="6" rx="1"/><rect x="5.5" y="5" width="4" height="10" rx="1" opacity=".7"/><rect x="11" y="0" width="4" height="15" rx="1" opacity=".5"/></svg>},
    {id:"transactions",label:"Transactions",
     icon:<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="1" y1="3.5" x2="14" y2="3.5"/><line x1="1" y1="7.5" x2="10" y2="7.5"/><line x1="1" y1="11.5" x2="7" y2="11.5"/></svg>},
    {id:"insights",label:"Insights",
     icon:<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="7.5" cy="7.5" r="6"/><polyline points="7.5,4.5 7.5,8 10,9.5"/></svg>},
  ];

  const thS=k=>({padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:sortKey===k?T.blue:T.text3,textTransform:"uppercase",letterSpacing:"0.09em",cursor:"pointer",whiteSpace:"nowrap",userSelect:"none",borderBottom:`1px solid ${T.border}`});
  const tdS={padding:"11px 14px",borderBottom:`1px solid ${T.border}`,fontSize:13,color:T.text1,verticalAlign:"middle"};

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.bg0};color:${T.text1};font-family:'DM Sans','Segoe UI',sans-serif;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${T.bg1};}
        ::-webkit-scrollbar-thumb{background:${T.bg3};border-radius:4px;}
        input::placeholder{color:${T.text3};}
        input,select{color-scheme:dark;}
        .tr-row:hover{background:${T.bg2} !important;}
        .nav-btn:hover{background:${T.bg3} !important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.35s ease both;}
        .fade-up-1{animation:fadeUp 0.35s 0.05s ease both;}
        .fade-up-2{animation:fadeUp 0.35s 0.10s ease both;}
        .fade-up-3{animation:fadeUp 0.35s 0.15s ease both;}
      `}</style>

      <div style={{display:"flex",minHeight:"100vh",background:T.bg0}}>

        {/* ── Sidebar ── */}
        <aside style={{width:210,background:T.bg1,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",padding:"20px 12px",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 10px 22px"}}>
            <div style={{width:34,height:34,background:T.blue,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14L7 8.5l3 4.5 2.5-7L17 14" stroke="white" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/></svg>
            </div>
            <span style={{fontWeight:800,fontSize:17,color:T.text1,letterSpacing:"-0.5px"}}>FinFlow</span>
          </div>

          {/* Nav */}
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            {NAV.map(n=>(
              <button key={n.id} className="nav-btn" onClick={()=>setTab(n.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:tab===n.id?T.bg3:"transparent",cursor:"pointer",color:tab===n.id?T.text1:T.text2,fontSize:13,fontWeight:tab===n.id?600:400,textAlign:"left",transition:"all 0.15s"}}>
                <span style={{color:tab===n.id?T.blue:T.text3}}>{n.icon}</span>{n.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{borderTop:`1px solid ${T.border}`,margin:"16px 0"}}/>

          {/* Stats */}
          <div style={{padding:"0 10px",display:"flex",flexDirection:"column",gap:10}}>
            {[{l:"Balance",v:fmt(balance),c:balance>=0?T.green:T.red},{l:"Income",v:fmt(totalIncome),c:T.green},{l:"Expenses",v:fmt(totalExpense),c:T.red}].map((s,i)=>(
              <div key={i}>
                <div style={{fontSize:10,color:T.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{s.l}</div>
                <div style={{fontSize:14,fontWeight:700,color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{marginTop:"auto",paddingTop:16}}>
            <div style={{fontSize:10,color:T.text3,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:7,padding:"0 2px"}}>Role</div>
            <select value={role} onChange={e=>setRole(e.target.value)}
              style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bg3,color:role==="admin"?T.blue:T.text2,fontSize:12,fontWeight:700,cursor:"pointer",outline:"none"}}>
              <option value="admin" style={{background:T.bg2}}>⬡ Admin</option>
              <option value="viewer" style={{background:T.bg2}}>◎ Viewer</option>
            </select>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{flex:1,overflowY:"auto",padding:"28px 24px",minWidth:0}}>

          {/* Top bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:22,fontWeight:800,color:T.text1,letterSpacing:"-0.5px"}}>{tab==="overview"?"Dashboard":tab==="transactions"?"Transactions":"Insights"}</div>
              <div style={{fontSize:13,color:T.text3,marginTop:2}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
            </div>
            {role==="admin"&&tab==="transactions"&&(
              <button onClick={()=>{setEditTxn(null);setModal(true);}}
                style={{padding:"10px 18px",borderRadius:10,border:"none",background:T.blue,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,letterSpacing:"0.02em"}}>
                + New Transaction
              </button>
            )}
          </div>

          {/* ── OVERVIEW ── */}
          {tab==="overview"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {/* KPI cards */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
                {[
                  {label:"Net Balance",value:balance,color:balance>=0?T.green:T.red,glow:balance>=0?T.greenGlow:T.redGlow,spark:balanceTrend.map(d=>d.balance),cls:"fade-up"},
                  {label:"Total Income",value:totalIncome,color:T.green,glow:T.greenGlow,spark:monthlyData.map(m=>m.income),cls:"fade-up-1"},
                  {label:"Total Expenses",value:totalExpense,color:T.red,glow:T.redGlow,spark:monthlyData.map(m=>m.expense),cls:"fade-up-2"},
                  {label:"Savings Rate",value:saveRate,isSaveRate:true,color:saveRate>=20?T.green:saveRate>=0?T.amber:T.red,glow:saveRate>=20?T.greenGlow:T.amberGlow,spark:monthlyData.map((_,i)=>i),cls:"fade-up-3"},
                ].map((c,i)=>(
                  <div key={i} className={c.cls} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${c.color},transparent)`}}/>
                    <div style={{fontSize:11,color:T.text3,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:10}}>{c.label}</div>
                    <div style={{fontSize:28,fontWeight:800,color:c.color,letterSpacing:"-1px",lineHeight:1}}>
                      {c.isSaveRate?`${saveRate}%`:<AnimNum to={c.value}/>}
                    </div>
                    <div style={{position:"absolute",bottom:14,right:16}}><Spark data={c.spark} color={c.color}/></div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
                <Card>
                  <SecTitle>Monthly Income vs Expenses</SecTitle>
                  <BarChart monthlyData={monthlyData}/>
                  <div style={{display:"flex",gap:16,marginTop:10,fontSize:11,color:T.text2}}>
                    <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,background:T.green,borderRadius:2}}/>Income</span>
                    <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,background:T.red,borderRadius:2}}/>Expenses</span>
                  </div>
                </Card>
                <Card>
                  <SecTitle>Spending Breakdown</SecTitle>
                  <Donut data={spendByCat}/>
                </Card>
              </div>

              {/* Balance trend */}
              <Card>
                <SecTitle>Net Balance Trend</SecTitle>
                <AreaChart balanceTrend={balanceTrend}/>
              </Card>

              {/* Recent txns */}
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <SecTitle style={{marginBottom:0}}>Recent Activity</SecTitle>
                  <button onClick={()=>setTab("transactions")} style={{fontSize:12,color:T.blue,background:"none",border:"none",cursor:"pointer",padding:0,fontWeight:600}}>View all →</button>
                </div>
                {[...transactions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map((t,i,arr)=>(
                  <div key={t.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:36,height:36,borderRadius:10,background:(CAT_COLORS[t.category]||T.text3)+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                        {CAT_EMOJI[t.category]||"💰"}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:500,color:T.text1}}>{t.note}</div>
                        <div style={{fontSize:11,color:T.text3,marginTop:1}}>{t.category} · {new Date(t.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</div>
                      </div>
                    </div>
                    <div style={{fontSize:14,fontWeight:700,color:t.type==="income"?T.green:T.red}}>
                      {t.type==="income"?"+":"−"}{fmt(t.amount)}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* ── TRANSACTIONS ── */}
          {tab==="transactions"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Card style={{padding:"14px 18px"}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
                  <div style={{position:"relative",flex:"1 1 200px"}}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={T.text3} strokeWidth="1.5" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}>
                      <circle cx="5.5" cy="5.5" r="4"/><line x1="9" y1="9" x2="12" y2="12"/>
                    </svg>
                    <input placeholder="Search transactions…" value={search} onChange={e=>setSearch(e.target.value)}
                      style={{...iStyle,paddingLeft:30}}/>
                  </div>
                  {[{v:fType,s:setFType,opts:[["all","All Types"],["income","Income"],["expense","Expense"]]},
                    {v:fCat,s:setFCat,opts:[["all","All Categories"],...allCats.map(c=>[c,c])]}].map((sel,i)=>(
                    <select key={i} value={sel.v} onChange={e=>sel.s(e.target.value)}
                      style={{padding:"9px 10px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bg3,color:T.text1,fontSize:12,cursor:"pointer",outline:"none"}}>
                      {sel.opts.map(([v,l])=><option key={v} value={v} style={{background:T.bg2}}>{l}</option>)}
                    </select>
                  ))}
                  <button onClick={exportCSV} style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",cursor:"pointer",fontSize:12,color:T.text2}}>
                    Export CSV
                  </button>
                </div>
              </Card>

              <Card style={{padding:0,overflow:"hidden"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead style={{background:T.bg2}}>
                      <tr>
                        {[["date","Date"],["amount","Amount"],["category","Category"],["type","Type"],["note","Note"]].map(([k,l])=>(
                          <th key={k} onClick={()=>handleSort(k)} style={thS(k)}>{l}{sortKey===k?(sortDir==="asc"?" ↑":" ↓"):""}</th>
                        ))}
                        {role==="admin"&&<th style={{...thS("_"),cursor:"default"}}/>}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length===0&&<tr><td colSpan={role==="admin"?6:5} style={{...tdS,textAlign:"center",padding:40,color:T.text3}}>No transactions found</td></tr>}
                      {filtered.map(t=>(
                        <tr key={t.id} className="tr-row" style={{transition:"background 0.1s"}}>
                          <td style={{...tdS,color:T.text2,fontSize:12}}>{new Date(t.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"2-digit"})}</td>
                          <td style={{...tdS,fontWeight:700,color:t.type==="income"?T.green:T.red}}>{t.type==="income"?"+":"−"}{fmt(t.amount)}</td>
                          <td style={tdS}>
                            <span style={{background:(CAT_COLORS[t.category]||T.text3)+"28",color:CAT_COLORS[t.category]||T.text2,padding:"3px 9px",borderRadius:6,fontSize:11,fontWeight:600}}>
                              {CAT_EMOJI[t.category]} {t.category}
                            </span>
                          </td>
                          <td style={tdS}>
                            <span style={{background:t.type==="income"?T.greenGlow:T.redGlow,color:t.type==="income"?T.green:T.red,padding:"3px 9px",borderRadius:6,fontSize:11,fontWeight:600}}>
                              {t.type}
                            </span>
                          </td>
                          <td style={{...tdS,color:T.text2}}>{t.note}</td>
                          {role==="admin"&&(
                            <td style={{...tdS,whiteSpace:"nowrap"}}>
                              <button onClick={()=>{setEditTxn(t);setModal(true);}} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",cursor:"pointer",fontSize:11,color:T.text2,marginRight:6}}>Edit</button>
                              <button onClick={()=>delTxn(t.id)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${T.red}44`,background:T.redGlow,cursor:"pointer",fontSize:11,color:T.red}}>Del</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{padding:"9px 16px",fontSize:11,color:T.text3,borderTop:`1px solid ${T.border}`}}>
                  {filtered.length} of {transactions.length} transactions
                </div>
              </Card>
            </div>
          )}

          {/* ── INSIGHTS ── */}
          {tab==="insights"&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
                {[
                  {label:"Top Category",value:topCat?.label||"—",sub:topCat?fmt(topCat.value)+" total":"",color:T.red},
                  {label:"MoM Spending",value:spendDelta!=null?(spendDelta>0?"+":"")+spendDelta+"%":"—",sub:lastM?`${lastM.label}: ${fmt(lastM.expense)}`:"",color:spendDelta>0?T.red:T.green},
                  {label:"Savings Rate",value:saveRate+"%",sub:`${fmt(balance)} saved total`,color:saveRate>=20?T.green:T.amber},
                  {label:"Avg Monthly Spend",value:monthlyData.length?fmt(Math.round(totalExpense/monthlyData.length)):"—",sub:`across ${monthlyData.length} months`,color:T.blue},
                ].map((k,i)=>(
                  <Card key={i} style={{borderLeft:`2px solid ${k.color}`,paddingLeft:18}}>
                    <div style={{fontSize:11,color:T.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{k.label}</div>
                    <div style={{fontSize:22,fontWeight:800,color:k.color,letterSpacing:"-0.5px"}}>{k.value}</div>
                    <div style={{fontSize:12,color:T.text3,marginTop:4}}>{k.sub}</div>
                  </Card>
                ))}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
                <Card>
                  <SecTitle>Spending by Category</SecTitle>
                  <HBar data={spendByCat} total={totalExpense}/>
                </Card>
                <Card>
                  <SecTitle>Income Sources</SecTitle>
                  <HBar data={Object.entries(transactions.filter(t=>t.type==="income").reduce((m,t)=>{m[t.category]=(m[t.category]||0)+t.amount;return m;},{})).sort((a,b)=>b[1]-a[1]).map(([l,v])=>({label:l,value:v,color:CAT_COLORS[l]||T.blue}))} total={totalIncome}/>
                </Card>
              </div>

              {/* Monthly table */}
              <Card>
                <SecTitle>Monthly Breakdown</SecTitle>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead>
                      <tr>
                        {["Month","Income","Expenses","Net","Savings %"].map(h=>(
                          <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.09em",borderBottom:`1px solid ${T.border}`}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((m,i)=>{
                        const net=m.income-m.expense;
                        const sp=m.income>0?Math.round((net/m.income)*100):0;
                        return (
                          <tr key={i} className="tr-row" style={{transition:"background 0.1s"}}>
                            <td style={{...tdS,fontWeight:600}}>{m.label} {m.year}</td>
                            <td style={{...tdS,color:T.green,fontWeight:600}}>{fmt(m.income)}</td>
                            <td style={{...tdS,color:T.red,fontWeight:600}}>{fmt(m.expense)}</td>
                            <td style={{...tdS,fontWeight:700,color:net>=0?T.green:T.red}}>{net>=0?"+":"−"}{fmt(net)}</td>
                            <td style={tdS}>
                              <span style={{background:sp>=20?T.greenGlow:sp>=0?T.amberGlow:T.redGlow,color:sp>=20?T.green:sp>=0?T.amber:T.red,padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700}}>{sp}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Key numbers */}
              <Card>
                <SecTitle>Summary Stats</SecTitle>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16}}>
                  {[
                    {l:"Total transactions",v:transactions.length,c:T.blue},
                    {l:"Income entries",v:transactions.filter(t=>t.type==="income").length,c:T.green},
                    {l:"Expense entries",v:transactions.filter(t=>t.type==="expense").length,c:T.red},
                    {l:"Categories used",v:allCats.length,c:T.purple},
                    {l:"Months tracked",v:monthlyData.length,c:T.teal},
                    {l:"Avg txn size",v:transactions.length?fmt(Math.round((totalIncome+totalExpense)/transactions.length)):"—",c:T.amber},
                  ].map((s,i)=>(
                    <div key={i} style={{background:T.bg2,borderRadius:10,padding:"12px 14px"}}>
                      <div style={{fontSize:11,color:T.text3,marginBottom:6,letterSpacing:"0.04em"}}>{s.l}</div>
                      <div style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {role==="viewer"&&(
                <div style={{background:T.blueGlow,border:`1px solid ${T.blue}44`,borderRadius:12,padding:"14px 18px",fontSize:13,color:T.blue}}>
                  You're in Viewer mode. Switch to Admin to add or edit transactions.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {modal&&role==="admin"&&(
        <Modal title={editTxn?"Edit Transaction":"New Transaction"} onClose={()=>setModal(false)}>
          <TxnForm initial={editTxn} onClose={()=>setModal(false)} onSave={editTxn?editSave:addTxn}/>
        </Modal>
      )}
    </>
  );
}

