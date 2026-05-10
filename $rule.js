1.open links:

(function(){   function findAndClickTargets(doc) {     try {       const links = Array.from(doc.querySelectorAll("a"));       let found = false;        const bivLink = links.find(link => link.textContent.trim().includes("BIV"));       if (bivLink) {         bivLink.click();         console.log("✅ BIV clicked");         found = true;       }        const idvLink = links.find(link => link.textContent.trim().includes("IDV"));       if (idvLink) {         idvLink.click();         console.log("✅ IDV-BO-LR-POC clicked");         found = true;       }        const workflowLink = links.find(link =>         link.textContent.trim().includes("Workflow History For CID")       );       if (workflowLink) {         workflowLink.click();         console.log("✅ Workflow History clicked");         found = true;       }        return found;     } catch (e) {       console.log("❌ Error finding links:", e);     }     return false;   }    function searchAllFrames(win) {     try {       if (findAndClickTargets(win.document)) return true;       for (let i = 0; i < win.frames.length; i++) {         try {           if (searchAllFrames(win.frames[i])) return true;         } catch (err) {}       }     } catch (err) {}     return false;   }    const success = searchAllFrames(window);   if (!success) {   return  } })();

2.click All doc:

(function(){let r=[];(function s(d){d.querySelectorAll('a').forEach(a=>{a.textContent.includes('All Documents')&&r.push(a)});d.querySelectorAll('iframe').forEach(f=>{try{let c=f.contentDocument||f.contentWindow?.document;c&&s(c)}catch(e){}})})(document);r[0]?r[0].click():console.log('未找到');})();

3.All click:

(()=>{function e(t,n=[]){try{t.document&&n.push(t.document);for(let o=0;o<t.frames.length;o++)e(t.frames[o],n)}catch(o){}return n}function t(e){try{const t=e.querySelectorAll('input[value="calypso_answer_positive"]');return t.forEach(e=>e.click()),t.length}catch(n){return 0}}function n(e){const t=e.querySelector("h2.navbar-brand");return t?t.textContent.trim():""}function o(e,t){const n=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")?.set;n?n.call(e,t):e.value=t,e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0}))}function r(e,t){const n=[...e.querySelectorAll(".no-side-padding, div, span, label")].find(e=>(e.textContent||"").trim()===t);if(!n)return null;const o=n.closest(".row")||n.parentElement;if(!o)return null;const r=o.querySelector(".normal-input strong")||o.querySelector(".normal-input")||o.querySelector("strong");return r?r.textContent.trim():null}function i(e){for(const t of e){const e=t.querySelector("#annotationText")||t.querySelector('textarea[name="annotationText"]')||t.querySelector('textarea[placeholder="Enter annotations"]');if(e)return e}return null}function c(e){const t=e.find(e=>"Business Verification"===n(e));if(!t)return!1;const c=r(t,"Business Name");if(!c)return!1;const a=i(e);return a?(o(a,c),!0):!1}function a(e){return/^[0-9]{17}[0-9Xx]$/.test(e)}function u(e){const t=e.substring(6,10),n=e.substring(10,12),o=e.substring(12,14);return`${o}/${n}/${t}`}function l(e){if(!e)return null;const t=e.trim();if(/^\d{2}\/\d{2}\/\d{4}$/.test(t))return t;const n=t.match(/^([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})$/);if(n){const e={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"}[n[1]],t=String(n[2]).padStart(2,"0"),o=n[3];return e?`${t}/${e}/${o}`:null}return null}function d(e){const t=e.querySelector('label[for="calypso_idv_verification_question_dob_calypso_answer_negative"]');t&&t.click(),setTimeout(()=>{const t=e.querySelector('label[for="calypso_na_idv_final_question_outcome_calypso_answer_request_more_info"]');t&&t.click()},300),setTimeout(()=>{const t=e.querySelector('label[for="calypso_na_idv_final_question_outcome_calypso_rfi_date_of_birth"]');t&&t.click()},600)}function s(e){const t=e.find(e=>{const t=n(e);return"Identity Verification"===t||"Identify Verification"===t});if(!t)return!1;const o=r(t,"ID Number"),i=r(t,"DOB");if(!o||!i)return!1;if(!a(o))return!0;const c=u(o),s=l(i);if(!s)return!1;if(c===s){const e=[...t.querySelectorAll(".no-side-padding, div, span, label")].find(e=>(e.textContent||"").trim()==="DOB"),n=e?.closest(".row")||e?.parentElement,o=n?.querySelector(".normal-input strong");return o&&(o.style.backgroundColor="yellow"),!0}return d(t),!0}const f=e(window);f.forEach(e=>{t(e)}),c(f),s(f)})();


4.i2v fail
javascript:(function(){function g(w,d){try{d.push(w.document);for(let i=0;i<w.frames.length;i++){try{g(w.frames[i],d)}catch(e){}}}catch(e){}return d}function p(doc){try{doc.querySelectorAll('input[value="calypso_answer_positive"]').forEach(e=>e.click())}catch(e){}}function f(doc,t){const l=[...doc.querySelectorAll("label")].find(e=>e.textContent.trim()===t);if(!l)return"";let n=l.parentElement;while(n){const f=n.querySelectorAll("input,textarea,select,span,div");for(const e of f){if("value"in e&&e.value&&e.value.trim())return e.value.trim();if(e.textContent&&e.textContent.trim()&&e!==l)return e.textContent.trim()}n=n.parentElement}return""}function a(d){for(const doc of d){const ta=doc.querySelector('textarea[name="annotationText"]')||doc.querySelector('textarea[id="annotationText"]')||doc.querySelector("textarea");if(ta)return ta}return null}function s(el,v){try{const p=Object.getPrototypeOf(el),set=Object.getOwnPropertyDescriptor(p,"value")?.set;if(set)set.call(el,v);else el.value=v}catch(e){el.value=v}el.focus();el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}))}function b(d){for(const doc of d){const n=f(doc,"Business Name");if(!n)continue;const ta=a(d);if(!ta)return false;const t=n+' ".overAllRemarks":"Manual Review","overAllOutcome":"Fail",Deny for I2V fail';s(ta,t);return true}return false}async function o(d){const sl=m=>new Promise(r=>setTimeout(r,m));for(const doc of d){try{const r=doc.querySelector('input[value="OTHER"]'),ta=doc.getElementById("calypso_bl_legitimacy_question_calypso_override_other");if(!r||!ta)continue;r.click();r.checked=true;r.dispatchEvent(new Event("input",{bubbles:true}));r.dispatchEvent(new Event("change",{bubbles:true}));await sl(300);s(ta,"i2v fail");return true}catch(e){}}return false}function r(doc,d){const n=doc.querySelector('label[for="calypso_bl_legitimacy_question_calypso_answer_negative"]');if(n)n.click();setTimeout(()=>{const o=doc.querySelector('label[for="calypso_bl_legitimacy_question_calypso_override_other"]');if(o)o.click()},300);setTimeout(()=>{o(d)},700);setTimeout(()=>{const f=doc.querySelector('label[for="calypso_na_biv_final_question_outcome_calypso_answer_fail"]');if(f)f.click()},1100);setTimeout(()=>{b(d)},1400)}function m(){const d=g(window,[]);for(const doc of d)p(doc);for(const doc of d)r(doc,d)}m()})();


// super bowl
(()=>{
  function e(t,n=[]){
    try{t.document&&n.push(t.document);for(let o=0;o<t.frames.length;o++)e(t.frames[o],n);}catch(o){}
    return n;
  }
  function t(e){
    try{const t=e.querySelectorAll('input[value="calypso_answer_positive"]');t.forEach(e=>e.click());return t.length;}
    catch(n){return 0;}
  }
  function n(e){
    const t=e.querySelector("h2.navbar-brand");
    return t?t.textContent.trim():"";
  }
  function o(e,t){
    const n=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")?.set;
    n?n.call(e,t):e.value=t;
    e.dispatchEvent(new Event("input",{bubbles:!0}));
    e.dispatchEvent(new Event("change",{bubbles:!0}));
  }
  function r(e,t){
    const n=[...e.querySelectorAll(".no-side-padding, div, span, label")].find(e=>(e.textContent||"").trim()===t);
    if(!n)return null;
    const o=n.closest(".row")||n.parentElement;
    if(!o)return null;
    const r=o.querySelector(".normal-input strong")||o.querySelector(".normal-input")||o.querySelector("strong");
    return r?r.textContent.trim():null;
  }
  function i(e){
    for(const t of e){
      const e=t.querySelector("#annotationText")||t.querySelector('textarea[name="annotationText"]')||t.querySelector('textarea[placeholder="Enter annotations"]');
      if(e)return e;
    }
    return null;
  }
  function getArvtResult(docs){
    for(const doc of docs){
      const ta=doc.querySelector("textarea.ipv-annotations-text");
      if(!ta)continue;
      const raw=ta.value||ta.textContent||"";
      if(!raw.trim())continue;
      const lower=raw.toLowerCase();
      const m=raw.match(/"overAllOutcome"\s*:\s*"([^"]+)"/i);
      const outcome=m?m[1].toLowerCase():"";
      const isFail=outcome.includes("fail");
      const isSkip=lower.includes("skip");
      if(isFail&&!isSkip)return "fail";
      if(isSkip)return "skip";
      return "pass";
    }
    return "pass";
  }
  function runI2vFailFlow(docs){
    const sl=m=>new Promise(r=>setTimeout(r,m));
    function setVal(el,v){
      try{
        const proto=Object.getPrototypeOf(el);
        const set=Object.getOwnPropertyDescriptor(proto,"value")?.set;
        if(set)set.call(el,v);else el.value=v;
      }catch(e){el.value=v;}
      el.focus();
      el.dispatchEvent(new Event("input",{bubbles:true}));
      el.dispatchEvent(new Event("change",{bubbles:true}));
    }
    async function fillOtherInput(docs){
      for(const doc of docs){
        try{
          const radio=doc.querySelector('input[value="OTHER"]');
          const ta=doc.getElementById("calypso_bl_legitimacy_question_calypso_override_other");
          if(!radio||!ta)continue;
          radio.click();
          radio.checked=true;
          radio.dispatchEvent(new Event("input",{bubbles:true}));
          radio.dispatchEvent(new Event("change",{bubbles:true}));
          await sl(300);
          setVal(ta,"i2v fail");
          return true;
        }catch(e){}
      }
      return false;
    }
    for(const doc of docs){
      const negLabel=doc.querySelector('label[for="calypso_bl_legitimacy_question_calypso_answer_negative"]');
      if(!negLabel)continue;
      negLabel.click();
      setTimeout(()=>{
        const ol=doc.querySelector('label[for="calypso_bl_legitimacy_question_calypso_override_other"]');
        if(ol)ol.click();
      },300);
      setTimeout(()=>{fillOtherInput(docs);},700);
      setTimeout(()=>{
        const fl=doc.querySelector('label[for="calypso_na_biv_final_question_outcome_calypso_answer_fail"]');
        if(fl)fl.click();
      },1100);
      break;
    }
  }
  function c(docs){
    const bizDoc=docs.find(d=>n(d)==="Business Verification");
    if(!bizDoc)return false;
    const businessName=r(bizDoc,"Business Name");
    if(!businessName)return false;

    function highlightKeywords(){
      const k2s=["东莞","厦门","广州","上海","海口","合肥","成都","武侯","珠海","内蒙","北京","武汉","南京","苏州","无锡","常州","扬州","镇江","南通","盐城","徐州","连云港","淮安","宿迁","泰州","南昌","九江","景德镇","萍乡","新余","鹰潭","赣州","吉安","宜春","抚州","上饶","深圳","河南","昆明"];
      const e2=document.querySelectorAll("strong")[1];
      const specialKeywords={
        "北京":'2.3.2.2 北京地区新版纸质营业执照，签发日期在2019年3月22日之后的，公章内登记机关均表示为：北京市XX区市场监督管理局。如在该日期后公章内容出现其他表述，如"北京市工商行政管理局XX分局"，则为伪造。',
        "唐山":'2.3.3.1 河北省唐山市滦州市注册资本大写金额没有带上数字，则为伪造。',
        "内蒙":'2.3.4.1 内蒙古自治区签发的营业执照文件，如果没有普通话和蒙古语两种名称，则为伪造。',
        "合肥":'2.5.4.1 公司类型为"有限责任公司"，且住所位于市辖区(蜀山/瑶海/庐阳/包河区)时，若公章内签发机构不是"合肥市市场监督管理局"，则为伪造。',
        "厦门":'2.5.5.1 厦门地区纸质版营业执照的经营范围如果显示出具体的经营项目，则为伪造。',
        "淄博":'2.5.9.1 山东省淄博经济开发区营业执照注册资本大写金额没有带上数字，则为伪造。',
        "青岛":'2.5.10.1 山东省青岛市营业执照若注册资本为10万元，文字内容未写为"壹拾万元整"，则为伪造。',
        "泉州":'2.5.7.1 福建省泉州市丰泽区纸质版营业执照上的文字出现"注册资金"，则为伪造。',
        "周口":'2.6.1.1 河南省周口市纸质版营业执照上的文字出现"注册资金"，则为伪造。',
        "宜昌":'2.6.2.1 湖北省宜昌市纸质版营业执照如果公章内写的"市场监督管理局"简称为"市场监管局"，则为伪造。',
        "广州":'2.7.1.1 广州地区纸质版营业执照文本信息内不含有以"编号"开头的文件编号，或对"编号"使用其他文字表述，则为伪造。\n2.7.1.2 广州地区纸质版营业执照的经营范围如果显示出具体经营项目，则为伪造。',
        "深圳":'2.7.3.1 深圳市纸质版营业执照文本信息含有"注册资本"、"经营范围"、"营业期限"，则为伪造。',
        "珠海":'2.7.6.1 珠海地区纸质版营业执照文本信息内如果提及经营范围、注册资本，则为伪造。',
        "成都":'2.8.1.1 成都市高新区颁发的营业执照，签发日期2019年6月1日前：加盖公章文本信息不是"成都市工商行政管理局"、"成都市市场监督管理局"或"成都高新区市场和质量监督管理局"，则为伪造。\n签发日期2019年6月1日及之后：加盖公章文本信息不是"成都高新技术产业开发区市场监督管理局"，则为伪造。\n2.8.1.2 成都市锦江区颁发的营业执照\n签发日期2019年8月1日前：加盖公章文本信息不是"成都市锦江区市场和质量监督管理局"、"成都市锦江区市场监督管理局"或"成都市锦江区行政审批局"，则为伪造。\n签发日期2019年8月1日及之后：加盖公章文本信息不是"成都市锦江区行政审批局"，则为伪造【例外】外国法人独资类型企业除外。\n2.8.2.1 成都市武侯区新版营业执照，若上方没有武侯区证照公示系统+网址以及查询代码+条形码，则为伪造。',
        "西安":'2.9.1.1 陕西省西安市新版营业执照，若二维码上方出现编号则为伪造。',
        "海口":'D142815379:凹凸不平的黑色地砖,SECE省份与NID省份一致,Nickname:法人名拼音+(123)+(.)，无关联拼音+字母+数字@163.com。',
        "东莞":'D43520784:虎门+白纸背景,身份证:云南省+白墙/黑龙江+灰白墙。P137073741:花灯的深蓝色夜景画+注册资本：人民币壹佰万元',
        "昆明":'D113859303:五华区+色小碎石和白色小点的灰白背景，无关联拼音+字母+数字@163.com',
        "上海":'2.5.1.1 上海地区纸质版营业执照文本信息内不含有"证照编号"，或出现"证件编号"等其他表述方式，则为伪造。2.5.1.2 上海市松江区纸质营业执照公章内写的不是"上海市松江区市场监督管理局"，则为伪造，外商投资类型企业除外。2.5.1.3 上海市崇明区、上海自由贸易试验区纸质版营业执照若公章内将"市场监督管理局"简写为"市场监管局"，则为伪造。',
        "莆田":'P72810851:城厢区/荔城区新版营业执照 + 米白大理石背景'
      };
      if(e2&&e2.textContent){
        for(const [keyword,message] of Object.entries(specialKeywords)){
          if(e2.textContent.includes(keyword)){
            const box=document.createElement("div");
            box.style.border="1px solid red";
            box.style.padding="10px";
            box.style.marginTop="10px";
            box.style.backgroundColor="#f8d7da";
            box.style.color="#721c24";
            box.style.width="100%";
            box.innerHTML="<strong>提示:</strong> "+message;
            e2.insertAdjacentElement("afterend",box);
            break;
          }
        }
      }
      if(e2&&e2.textContent){
        k2s.forEach(kw=>{
          if(e2.textContent.includes(kw))
            e2.innerHTML=e2.innerHTML.replace(new RegExp(kw,"g"),"<span style='background-color:yellow'>"+kw+"</span>");
        });
      }
    }
    highlightKeywords();

    const annotationTA=i(docs);
    if(!annotationTA)return false;
    const arvtResult=getArvtResult(docs);
    let suffix="";
    if(arvtResult==="fail"){suffix="\nARVT results: Fail；Deny for I2V fail";}
    else if(arvtResult==="skip"){suffix="\nARVT results: ID skipped";}
    else{suffix="\nARVT results: Pass";}
    o(annotationTA,businessName+suffix);
    if(arvtResult==="fail"){runI2vFailFlow(docs);}
    return true;
  }
  function a(e){return /^[0-9]{17}[0-9Xx]$/.test(e);}
  function u(e){
    const t=e.substring(6,10),n=e.substring(10,12),o=e.substring(12,14);
    return o+"/"+n+"/"+t;
  }
  function l(e){
    if(!e)return null;
    const t=e.trim();
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(t))return t;
    const n=t.match(/^([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})$/);
    if(n){
      const monthMap={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
      const month=monthMap[n[1]];
      const day=String(n[2]).padStart(2,"0");
      const year=n[3];
      return month?day+"/"+month+"/"+year:null;
    }
    return null;
  }
  function d(e){
    const t=e.querySelector('label[for="calypso_idv_verification_question_dob_calypso_answer_negative"]');
    t&&t.click();
    setTimeout(()=>{
      const t=e.querySelector('label[for="calypso_na_idv_final_question_outcome_calypso_answer_request_more_info"]');
      t&&t.click();
    },300);
    setTimeout(()=>{
      const t=e.querySelector('label[for="calypso_na_idv_final_question_outcome_calypso_rfi_date_of_birth"]');
      t&&t.click();
    },600);
  }
  function s(docs){
    const targetDoc=docs.find(d=>{
      const title=n(d);
      return title==="Identity Verification"||title==="Identify Verification";
    });
    if(!targetDoc)return false;
    const idNum=r(targetDoc,"ID Number");
    const dob=r(targetDoc,"DOB");
    if(!idNum||!dob)return false;
    if(!a(idNum))return true;
    const idDob=u(idNum);
    const formDob=l(dob);
    if(!formDob)return false;
    if(idDob===formDob){
      const dobEl=[...targetDoc.querySelectorAll(".no-side-padding, div, span, label")].find(e=>(e.textContent||"").trim()==="DOB");
      const row=dobEl?.closest(".row")||dobEl?.parentElement;
      const strong=row?.querySelector(".normal-input strong");
      if(strong)strong.style.backgroundColor="yellow";
      return true;
    }
    d(targetDoc);
    return true;
  }
  const docs=e(window);
  docs.forEach(doc=>t(doc));
  c(docs);
  s(docs);
})();


// Reminder
(()=>{
  function e(t,n=[]){
    try{t.document&&n.push(t.document);for(let o=0;o<t.frames.length;o++)e(t.frames[o],n);}catch(o){}
    return n;
  }
  function t(e){
    try{const t=e.querySelectorAll('input[value="calypso_answer_positive"]');t.forEach(e=>e.click());return t.length;}
    catch(n){return 0;}
  }
  function n(e){
    const t=e.querySelector("h2.navbar-brand");
    return t?t.textContent.trim():"";
  }
  function o(e,t){
    const n=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")?.set;
    n?n.call(e,t):e.value=t;
    e.dispatchEvent(new Event("input",{bubbles:!0}));
    e.dispatchEvent(new Event("change",{bubbles:!0}));
  }
  function r(e,t){
    const n=[...e.querySelectorAll(".no-side-padding, div, span, label")].find(e=>(e.textContent||"").trim()===t);
    if(!n)return null;
    const o=n.closest(".row")||n.parentElement;
    if(!o)return null;
    const r=o.querySelector(".normal-input strong")||o.querySelector(".normal-input")||o.querySelector("strong");
    return r?r.textContent.trim():null;
  }
  function i(e){
    for(const t of e){
      const e=t.querySelector("#annotationText")||t.querySelector('textarea[name="annotationText"]')||t.querySelector('textarea[placeholder="Enter annotations"]');
      if(e)return e;
    }
    return null;
  }
  function getArvtResult(docs){
    for(const doc of docs){
      const ta=doc.querySelector("textarea.ipv-annotations-text");
      if(!ta)continue;
      const raw=ta.value||ta.textContent||"";
      if(!raw.trim())continue;
      const lower=raw.toLowerCase();
      const m=raw.match(/"overAllOutcome"\s*:\s*"([^"]+)"/i);
      const outcome=m?m[1].toLowerCase():"";
      const isFail=outcome.includes("fail");
      const isSkip=lower.includes("skip");
      if(isFail&&!isSkip)return "fail";
      if(isSkip)return "skip";
      return "pass";
    }
    return "pass";
  }
  function runI2vFailFlow(docs){
    const sl=m=>new Promise(r=>setTimeout(r,m));
    function setVal(el,v){
      try{
        const proto=Object.getPrototypeOf(el);
        const set=Object.getOwnPropertyDescriptor(proto,"value")?.set;
        if(set)set.call(el,v);else el.value=v;
      }catch(e){el.value=v;}
      el.focus();
      el.dispatchEvent(new Event("input",{bubbles:true}));
      el.dispatchEvent(new Event("change",{bubbles:true}));
    }
    async function fillOtherInput(docs){
      for(const doc of docs){
        try{
          const radio=doc.querySelector('input[value="OTHER"]');
          const ta=doc.getElementById("calypso_bl_legitimacy_question_calypso_override_other");
          if(!radio||!ta)continue;
          radio.click();
          radio.checked=true;
          radio.dispatchEvent(new Event("input",{bubbles:true}));
          radio.dispatchEvent(new Event("change",{bubbles:true}));
          await sl(300);
          setVal(ta,"i2v fail");
          return true;
        }catch(e){}
      }
      return false;
    }
    for(const doc of docs){
      const negLabel=doc.querySelector('label[for="calypso_bl_legitimacy_question_calypso_answer_negative"]');
      if(!negLabel)continue;
      negLabel.click();
      setTimeout(()=>{
        const ol=doc.querySelector('label[for="calypso_bl_legitimacy_question_calypso_override_other"]');
        if(ol)ol.click();
      },300);
      setTimeout(()=>{fillOtherInput(docs);},700);
      setTimeout(()=>{
        const fl=doc.querySelector('label[for="calypso_na_biv_final_question_outcome_calypso_answer_fail"]');
        if(fl)fl.click();
      },1100);
      break;
    }
  }
  function c(docs){
    const bizDoc=docs.find(d=>n(d)==="Business Verification");
    if(!bizDoc)return false;
    const businessName=r(bizDoc,"Business Name");
    if(!businessName)return false;

    function highlightKeywords(){
      const element=bizDoc.querySelector('div.sop-section-header-div.col-md-12 > h3.sop-section-header.col-md-6');
      const k2s=['宜昌','襄阳','阳江','厦门','广州','上海','海口','合肥','成都','武侯','珠海','内蒙','北京','武汉','南京','苏州','无锡','常州','扬州','镇江','南通','盐城','徐州','连云港','淮安','宿迁','泰州','南昌','九江','景德镇','萍乡','新余','鹰潭','赣州','吉安','宜春','抚州','上饶','深圳','河南','昆明'];
      const e2=bizDoc.querySelectorAll('strong')[1];
      const specialKeywords={
        '北京':'2.3.2.2 北京地区新版纸质营业执照，签发日期在2019年3月22日之后的，公章内登记机关均表示为：北京市XX区市场监督管理局。如在该日期后公章内容出现其他表述，如"北京市工商行政管理局XX分局"，则为伪造。',
        '唐山':'2.3.3.1 河北省唐山市滦州市注册资本大写金额没有带上数字，则为伪造。',
        '内蒙':'2.3.4.1 内蒙古自治区签发的营业执照文件，如果没有普通话和蒙古语两种名称，则为伪造。',
        '合肥':'2.5.4.1 公司类型为"有限责任公司"，且住所位于市辖区(蜀山/瑶海/庐阳/包河区)时，若公章内签发机构不是"合肥市市场监督管理局"，则为伪造。',
        '厦门':'2.5.5.1 厦门地区纸质版营业执照的经营范围如果显示出具体的经营项目，则为伪造。',
        '淄博':'2.5.9.1 山东省淄博经济开发区营业执照注册资本大写金额没有带上数字，则为伪造。',
        '青岛':'2.5.10.1 山东省青岛市营业执照若注册资本为10万元，文字内容未写为"壹拾万元整"，则为伪造。',
        '泉州':'2.5.7.1 福建省泉州市丰泽区纸质版营业执照上的文字出现"注册资金"，则为伪造。',
        '周口':'2.6.1.1 河南省周口市纸质版营业执照上的文字出现"注册资金"，则为伪造。',
        '宜昌':'2.6.2.1 湖北省宜昌市纸质版营业执照如果公章内写的"市场监督管理局"简称为"市场监管局"，则为伪造。',
        '广州':'2.7.1.1 广州地区纸质版营业执照文本信息内不含有以"编号"开头的文件编号，或对"编号"使用其他文字表述，则为伪造。\n2.7.1.2 广州地区纸质版营业执照的经营范围如果显示出具体经营项目，则为伪造。\n2.7.1.3 广东省广州市海珠区新版营业执照，2018年8月1日之后刻的公章内缺少编号，则为伪造。\n2.7.1.4 广东省广州市天河区新版正本营业执照，下方出现年报提示语，则为伪造。',
        '深圳':'2.7.3.1 深圳市纸质版营业执照文本信息含有"注册资本"、"经营范围"、"营业期限"，则为伪造。',
        '珠海':'2.7.6.1 珠海地区纸质版营业执照文本信息内如果提及经营范围、注册资本，则为伪造。',
        '成都':'2.8.1.1 成都市高新区颁发的营业执照，签发日期2019年6月1日前：加盖公章文本信息不是"成都市工商行政管理局"、"成都市市场监督管理局"或"成都高新区市场和质量监督管理局"，则为伪造。\n签发日期2019年6月1日及之后：加盖公章文本信息不是"成都高新技术产业开发区市场监督管理局"，则为伪造。\n2.8.1.2 成都市锦江区颁发的营业执照\n签发日期2019年8月1日前：加盖公章文本信息不是"成都市锦江区市场和质量监督管理局"、"成都市锦江区市场监督管理局"或"成都市锦江区行政审批局"，则为伪造。\n签发日期2019年8月1日及之后：加盖公章文本信息不是"成都市锦江区行政审批局"，则为伪造【例外】外国法人独资类型企业除外。\n2.8.2.1 成都市武侯区新版营业执照，若上方没有武侯区证照公示系统+网址以及查询代码+条形码，则为伪造。',
        '西安':'2.9.1.1 陕西省西安市新版营业执照，若二维码上方出现编号则为伪造。',
        '上海':'2.5.1.1 上海地区纸质版营业执照文本信息内不含有"证照编号"，或出现"证件编号"等其他表述方式，则为伪造。',
        '龙岩':'2.5.11.1 福建省龙岩市新版营业执照，若公章内缺少编码，则为伪造。',
        '泰安':'2.5.13 山东省泰安市宁阳县纸质版营业执照，签发日期在2018年12月01日及之后的，公章内登记机关均表示为：XX行政审批服务局。如在该日期后公章内容出现其他表述，如"XXX市场监督管理局"，则为伪造（仅针对内资企业，外资企业包括港澳台公章不变）。',
        '东莞':'2.7.7.1 广东省东莞市，2017年及之后成立的企业，若新版营业执照未出现条形码，则为造假。',
        '南宁':'2.7.10.1 广西壮族自治区南宁市纸质版营业执照上的文字出现"注册资金"，则为伪造。\n2.7.12.1 广西壮族自治区纸质版新版营业执照内含有以"编号"，则为伪造。',
        '西藏':'2.8.5.1 西藏自治区新版营业执照，若标题未使用双语（藏语+简体中文）则为伪造。'
      };
      const generalMessage=
        '2.5.4.1 江苏地区新版纸质营业执照右上角二维码上方不含有以"编号"开头的文件编号，或对"编号"使用其他文字表述，则为伪造。<br>'+
        '2.5.12.1 江西地区纸质版营业执照右上角边框外不含有以"证照编号"开头的文件编号，则为伪造。<br>'+
        '2.8.6.1 云南省新版营业执照，下方网址显示除 http://yn.gsxt.gov.cn 以外的其他网址，则为造假。<br>'+
        '2.7.8.1 签发日期在2024年5月6日及以后，海南省纸质版营业执照文本信息含有"注册资本"、"经营范围"、"营业期限"，则为伪造。<br>'+
        '2.7.8.2 海南省纸质版营业执照，若左下方重要提示中出现任一以下错别字/错误描述，则为伪造：登陆（正确描述为登录）、出资额度（正确描述为出资额）。<br>'+
        '2.2.1.1 新版纸质营业执照，二维码右侧提示信息中所用文字与以下内容不同，则为伪造：扫描二维码登录"国家企业信用信息公示系统"了解更多登记、备案、许可、监管信息。<br>'+
        '2.2.2. 二维码右侧提示信息内容标点符号错误。<br>'+
        '2.9.2.1 甘肃省纸质版营业执照上的文字出现"注册资金"，则为伪造。<br>'+
        '2.10.9.1 若香港商业登记条例内容出现简体中文而非繁体中文，则为伪造。';

      let redBoxInserted=false;
      if(e2&&e2.textContent&&!e2.nextElementSibling?.classList?.contains('alert-reminder')){
        for(const [keyword,message] of Object.entries(specialKeywords)){
          if(e2.textContent.includes(keyword)){
            const box=bizDoc.createElement('div');
            box.className='alert-reminder';
            box.style.border='1px solid red';
            box.style.padding='10px';
            box.style.marginTop='10px';
            box.style.backgroundColor='#f8d7da';
            box.style.color='#721c24';
            box.style.width='550px';
            box.innerHTML='<strong>提示:</strong> '+message;
            e2.insertAdjacentElement('afterend',box);
            redBoxInserted=true;
            break;
          }
        }
      }

      if(element&&!bizDoc.querySelector('.general-alert-reminder')){
        const generalAlert=bizDoc.createElement('div');
        generalAlert.className='general-alert-reminder';
        generalAlert.style.border='1px solid blue';
        generalAlert.style.padding='10px';
        generalAlert.style.marginTop='10px';
        generalAlert.style.backgroundColor='#d1ecf1';
        generalAlert.style.color='#0c5460';
        generalAlert.style.width='550px';
        generalAlert.innerHTML='<strong>通用提示:</strong><br>'+generalMessage;
        if(redBoxInserted&&e2){
          const redBox=e2.nextElementSibling;
          if(redBox&&redBox.classList.contains('alert-reminder')){
            redBox.insertAdjacentElement('afterend',generalAlert);
          }else{
            element.insertAdjacentElement('afterend',generalAlert);
          }
        }else{
          element.insertAdjacentElement('afterend',generalAlert);
        }
      }

      if(e2&&e2.textContent){
        k2s.forEach(k2=>{
          if(e2.textContent.includes(k2)&&!e2.innerHTML.includes('background-color: yellow')){
            e2.innerHTML=e2.innerHTML.replace(new RegExp(k2,'g'),'<span style="background-color: yellow">'+k2+'</span>');
          }
        });
      }
    }
    highlightKeywords();

    const annotationTA=i(docs);
    if(!annotationTA)return false;
    const arvtResult=getArvtResult(docs);
    let suffix="";
    if(arvtResult==="fail"){suffix="\nARVT results: Fail；Deny for I2V fail";}
    else if(arvtResult==="skip"){suffix="\nARVT results: ID skipped";}
    else{suffix="\nARVT results: Pass";}
    o(annotationTA,businessName+suffix);
    if(arvtResult==="fail"){runI2vFailFlow(docs);}
    return true;
  }
  function a(e){return /^[0-9]{17}[0-9Xx]$/.test(e);}
  function u(e){
    const t=e.substring(6,10),n=e.substring(10,12),o=e.substring(12,14);
    return o+"/"+n+"/"+t;
  }
  function l(e){
    if(!e)return null;
    const t=e.trim();
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(t))return t;
    const n=t.match(/^([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})$/);
    if(n){
      const monthMap={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
      const month=monthMap[n[1]];
      const day=String(n[2]).padStart(2,"0");
      const year=n[3];
      return month?day+"/"+month+"/"+year:null;
    }
    return null;
  }
  function d(e){
    const t=e.querySelector('label[for="calypso_idv_verification_question_dob_calypso_answer_negative"]');
    t&&t.click();
    setTimeout(()=>{
      const t=e.querySelector('label[for="calypso_na_idv_final_question_outcome_calypso_answer_request_more_info"]');
      t&&t.click();
    },300);
    setTimeout(()=>{
      const t=e.querySelector('label[for="calypso_na_idv_final_question_outcome_calypso_rfi_date_of_birth"]');
      t&&t.click();
    },600);
  }
  function s(docs){
    const targetDoc=docs.find(d=>{
      const title=n(d);
      return title==="Identity Verification"||title==="Identify Verification";
    });
    if(!targetDoc)return false;
    const idNum=r(targetDoc,"ID Number");
    const dob=r(targetDoc,"DOB");
    if(!idNum||!dob)return false;
    if(!a(idNum))return true;
    const idDob=u(idNum);
    const formDob=l(dob);
    if(!formDob)return false;
    if(idDob===formDob){
      const dobEl=[...targetDoc.querySelectorAll(".no-side-padding, div, span, label")].find(e=>(e.textContent||"").trim()==="DOB");
      const row=dobEl?.closest(".row")||dobEl?.parentElement;
      const strong=row?.querySelector(".normal-input strong");
      if(strong)strong.style.backgroundColor="yellow";

      //add
      const verifiedLabel=Array.from(targetDoc.querySelectorAll('label')).find(el=>el.textContent.trim()==='Verified');
      if(verifiedLabel)verifiedLabel.click();

      return true;
    }
    d(targetDoc);

    // add
    setTimeout(()=>{                    
      const annotationTA=i(docs);
      if(annotationTA)o(annotationTA,"RFD ID for DOB.");
    },1600);

    return true;
  }
  const docs=e(window);
  docs.forEach(doc=>t(doc));
  c(docs);
  s(docs);
})();




// All doc 
function findInAllFrames(labelName) {
    // 穿透 Shadow DOM 的逻辑
    function findInShadow(root, selector) {
        const found = root.querySelector(selector);
        if (found) return found;
        const children = root.querySelectorAll('*');
        for (let child of children) {
            if (child.shadowRoot) {
                const result = findInShadow(child.shadowRoot, selector);
                if (result) return result;
            }
        }
        return null;
    }

    // 1. 先在主页面找
    let target = findInShadow(document, `kat-button[label="${labelName}"]`);
    if (target) return target;

    // 2. 遍历所有 iframe 找
    const frames = document.querySelectorAll('iframe');
    for (let frame of frames) {
        try {
            // 注意：如果 iframe 跨域，此处会报错并跳过
            const frameDoc = frame.contentDocument || frame.contentWindow.document;
            target = findInShadow(frameDoc, `kat-button[label="${labelName}"]`);
            if (target) return target;
        } catch (e) {
            console.warn("无法进入 iframe (可能是跨域限制):", frame.src);
        }
    }
    return null;
}

// 执行点击逻辑
const btnHost = findInAllFrames('PERSONA_ID_DOCUMENT');
if (btnHost && btnHost.shadowRoot) {
    btnHost.shadowRoot.querySelector('button').click();
    console.log("✅ 跨 Iframe 点击成功");
} else {
    console.error("❌ 依然找不到元素，请检查 Iframe 是否跨域或元素尚未加载");
}
