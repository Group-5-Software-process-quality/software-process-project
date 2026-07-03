protectPage();

async function loadStatistics() {
  const users = await API.GET("/users");

  const events = await API.GET("/events");

  const orders = await API.GET("/orders");

  document.getElementById("totalUsers").innerHTML = users.length;

  document.getElementById("totalEvents").innerHTML = events.length;

  let revenue = 0;

  let paid = 0;

  let pending = 0;

  orders.forEach((o) => {
    if (o.status === "PAID") {
      paid++;

      revenue += o.totalAmount;
    }

    if (o.status === "PENDING") {
      pending++;
    }
  });

  document.getElementById("totalRevenue").innerHTML = money(revenue);

  new Chart(
    document.getElementById("statusChart"),

    {
      type: "pie",

      data: {
        labels: ["Paid", "Pending"],

        datasets: [
          {
            data: [paid, pending],
          },
        ],
      },
    },
  );

  new Chart(
    document.getElementById("revenueChart"),

    {
      type: "bar",

      data: {
        labels: orders.map((o) => "Order " + o.id),

        datasets: [
          {
            label: "Revenue",

            data: orders.map((o) => o.totalAmount),
          },
        ],
      },
    },
  );
}

loadStatistics();
