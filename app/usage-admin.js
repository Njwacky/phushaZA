(function(){
  const labels = {open:"App opens", vault:"Vault visits", pack:"Pack visits", ideas:"Ideas visits", money:"Money visits", path:"Path visits", cv_print:"CV print / PDF attempts", pdf_download:"PDF pack download attempts"};
  const form = document.querySelector("#login"), input = document.querySelector("#key"), message = document.querySelector("#message"), results = document.querySelector("#results"), totals = document.querySelector("#totals");
  form.addEventListener("submit", async event => {
    event.preventDefault(); results.hidden = true; totals.replaceChildren(); message.textContent = "Loading…";
    const secret = input.value; input.value = "";
    try {
      const res = await fetch("/.netlify/functions/usage-report", {headers:{Authorization:"Bearer " + secret}, credentials:"omit", cache:"no-store", referrerPolicy:"no-referrer"});
      if (res.status === 401) { message.textContent = "That key was not accepted. Check the Netlify environment setting and try again."; return; }
      if (!res.ok) { message.textContent = "The report is unavailable. Check that analytics is configured and deployed on the production site."; return; }
      const data = await res.json();
      for (const [key, label] of Object.entries(labels)){
        const card = document.createElement("div"), number = document.createElement("strong"), text = document.createElement("span");
        card.className = "metric"; number.textContent = String(Number(data.totals && data.totals[key]) || 0); text.textContent = label; card.append(number,text); totals.appendChild(card);
      }
      message.textContent = data.partial ? "Partial results: the report reached its safety limit. Totals may be incomplete." : "";
      results.hidden = false;
    } catch(e){ message.textContent = "Could not load the report. Check your connection and try again."; }
  });
})();
