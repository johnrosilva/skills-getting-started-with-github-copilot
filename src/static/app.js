document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const signupForm = document.getElementById("signup-form");
  const activitySelect = document.getElementById("activity-select");
  const emailInput = document.getElementById("email");
  const messageDiv = document.getElementById("message");

  // Buscar atividades da API
  fetch("/activities")
    .then((res) => res.json())
    .then((data) => {
      // Preencher lista de atividades
      Object.entries(data).forEach(([name, info]) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="activity-card">
            <strong>${name}</strong>: ${info.description}<br>
            <em>${info.schedule}</em><br>
            Vagas: ${info.participants.length}/${info.max_participants}
            <div class="participants-section">
              <span class="participants-title">Participantes:</span>
              <ul class="participants-list">
                ${
                  info.participants.length > 0
                    ? info.participants.map(email => `<li>${email}</li>`).join("")
                    : '<li><em>Nenhum participante ainda</em></li>'
                }
              </ul>
            </div>
          </div>
        `;
        activitiesList.appendChild(li);

        // Adicionar ao select do formulário
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        activitySelect.appendChild(opt);
      });
    });

  // Enviar inscrição
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    messageDiv.textContent = "";
    const activity = activitySelect.value;
    const email = emailInput.value;
    fetch(
      `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      }
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.message);
        messageDiv.textContent = data.message;
        messageDiv.style.color = "green";
      })
      .catch((err) => {
        messageDiv.textContent = err.message;
        messageDiv.style.color = "red";
      });
  });
});
