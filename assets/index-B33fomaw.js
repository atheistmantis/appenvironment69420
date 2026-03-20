(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();const _="nrea_recipes",y=[{id:"tpl-1",name:"Spaghetti Bolognese",image:"https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&q=80",description:"Classic Italian pasta with rich meat sauce."},{id:"tpl-2",name:"Chicken Curry",image:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",description:"Aromatic chicken curry with creamy sauce."},{id:"tpl-3",name:"Caesar Salad",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",description:"Crisp romaine lettuce with Caesar dressing."},{id:"tpl-4",name:"Pancakes",image:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",description:"Fluffy American pancakes with maple syrup."},{id:"tpl-5",name:"Grilled Salmon",image:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",description:"Perfectly grilled salmon fillet with herbs."},{id:"tpl-6",name:"Vegetable Stir Fry",image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",description:"Colourful vegetables tossed in savoury sauce."}];function E(){try{const e=localStorage.getItem(_);if(e){const t=JSON.parse(e);if(Array.isArray(t)&&t.length>0)return t}}catch{}return[...y]}function f(e){localStorage.setItem(_,JSON.stringify(e))}function C(e,t){const s={id:"r-"+Date.now(),name:t.name.trim(),image:t.image.trim(),description:(t.description||"").trim()},n=[...e,s];return f(n),n}function A(e,t){const s=e.filter(n=>n.id!==t);return f(s),s}function w(){const e=[...y];return f(e),e}function L(e,t,s=!1){const n=document.createElement("article");n.className="recipe-card",n.setAttribute("tabindex","0"),n.setAttribute("aria-label",e.name),n.style.backgroundImage=`url('${S(e.image)}')`;const a=document.createElement("div");a.className="recipe-card__overlay";const i=document.createElement("h2");if(i.className="recipe-card__name",i.textContent=e.name,a.appendChild(i),e.description){const r=document.createElement("p");r.className="recipe-card__desc",r.textContent=e.description,a.appendChild(r)}if(n.appendChild(a),s){const r=document.createElement("button");r.className="recipe-card__delete",r.type="button",r.setAttribute("aria-label",`Delete ${e.name}`),r.textContent="✕",r.addEventListener("click",l=>{l.stopPropagation(),confirm(`Delete "${e.name}"?`)&&t(e.id)}),n.appendChild(r)}return n}function S(e){if(!e)return"";const t=e.trim();return/^https?:\/\//i.test(t)||/^data:image\//i.test(t)?t:""}function R(e,t){const s=document.createElement("section");s.className="admin-panel",s.setAttribute("aria-label","Admin panel – add recipes");const n=document.createElement("button");n.type="button",n.className="admin-panel__toggle big-btn",n.setAttribute("aria-expanded","false"),n.setAttribute("aria-controls","admin-form"),n.textContent="⚙ Manage Recipes (Admin)";const a=document.createElement("form");a.id="admin-form",a.className="admin-panel__form",a.setAttribute("aria-hidden","true"),a.innerHTML=`
    <h2 class="admin-panel__heading">Add a New Recipe</h2>

    <div class="admin-panel__field">
      <label for="recipe-name" class="admin-panel__label">Dish Name <span aria-hidden="true">*</span></label>
      <input
        id="recipe-name"
        name="name"
        type="text"
        class="admin-panel__input"
        placeholder="e.g. Spaghetti Bolognese"
        required
        autocomplete="off"
      />
    </div>

    <div class="admin-panel__field">
      <label for="recipe-image" class="admin-panel__label">Image URL <span aria-hidden="true">*</span></label>
      <input
        id="recipe-image"
        name="image"
        type="url"
        class="admin-panel__input"
        placeholder="https://example.com/photo.jpg"
        required
        autocomplete="off"
      />
      <p class="admin-panel__hint">Paste a link to a photo of the dish (must start with http:// or https://)</p>
    </div>

    <div class="admin-panel__field">
      <label for="recipe-desc" class="admin-panel__label">Short Description</label>
      <textarea
        id="recipe-desc"
        name="description"
        class="admin-panel__input admin-panel__textarea"
        placeholder="A brief description of the dish…"
        rows="3"
      ></textarea>
    </div>

    <div class="admin-panel__actions">
      <button type="submit" class="big-btn admin-panel__submit">Add Recipe</button>
    </div>

    <div class="admin-panel__divider" role="separator"></div>

    <div class="admin-panel__actions">
      <button type="button" id="reset-btn" class="big-btn admin-panel__reset">
        Reset to Default Recipes
      </button>
    </div>
  `,s.appendChild(n),s.appendChild(a);let i=!1;function r(l){i=l,n.setAttribute("aria-expanded",String(i)),a.setAttribute("aria-hidden",String(!i)),a.classList.toggle("admin-panel__form--open",i)}return n.addEventListener("click",()=>r(!i)),a.addEventListener("submit",l=>{l.preventDefault();const o=Object.fromEntries(new FormData(a));if(!o.name||!o.name.trim()){h(a.querySelector("#recipe-name"),"Please enter a dish name.");return}if(!o.image||!o.image.trim()){h(a.querySelector("#recipe-image"),"Please enter an image URL.");return}e({name:o.name,image:o.image,description:o.description||""}),a.reset(),r(!1),g("Recipe added successfully!")}),a.querySelector("#reset-btn").addEventListener("click",()=>{confirm("This will remove all custom recipes and restore the defaults. Continue?")&&(t(),r(!1),g("Recipes reset to defaults."))}),s}function h(e,t){e.focus(),e.setCustomValidity(t),e.reportValidity(),e.addEventListener("input",()=>e.setCustomValidity(""),{once:!0})}function g(e){let t=document.getElementById("sr-announce");t||(t=document.createElement("div"),t.id="sr-announce",t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.style.cssText="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;",document.body.appendChild(t)),t.textContent="",requestAnimationFrame(()=>{t.textContent=e})}let d=E(),c=!1;const x=document.getElementById("app");x.innerHTML=`
  <header class="app-header" role="banner">
    <div class="app-header__inner">
      <span class="app-header__logo" aria-hidden="true">🍽</span>
      <h1 class="app-header__title">Easy Recipes</h1>
      <button
        type="button"
        id="admin-toggle"
        class="app-header__admin-btn"
        aria-pressed="false"
        title="Toggle admin mode"
      >
        ⚙
      </button>
    </div>
  </header>

  <main id="main" class="container" role="main">
    <div id="recipe-grid" class="recipe-grid" aria-label="Recipe collection"></div>
  </main>

  <div id="admin-area"></div>
`;const m=document.getElementById("admin-toggle");m.addEventListener("click",()=>{c=!c,m.setAttribute("aria-pressed",String(c)),m.classList.toggle("app-header__admin-btn--active",c),p(),v()});const b=document.getElementById("admin-area");function v(){if(b.innerHTML="",!c)return;const e=R(t=>{d=C(d,t),p()},()=>{d=w(),p()});b.appendChild(e)}const u=document.getElementById("recipe-grid");function p(){if(u.innerHTML="",d.length===0){const e=document.createElement("p");e.className="recipe-grid__empty",e.textContent="No recipes yet. Use the admin panel to add some!",u.appendChild(e);return}d.forEach(e=>{const t=L(e,N,c);u.appendChild(t)})}function N(e){d=A(d,e),p()}p();v();
