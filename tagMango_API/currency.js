const getAmount = (str, regex) => {
  const match = str.match(regex);
  if (match) {
    return Number(match[1]);
  }
  return null;
};

// Helper function to set a cookie
const setCookie = (name, value, minutesToExpire) => {
  if (
    typeof document === "undefined" ||
    typeof document.cookie === "undefined"
  ) {
    return; // Do nothing if not in a browser environment
  }
  const date = new Date();
  date.setTime(date.getTime() + minutesToExpire * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

// Helper function to get a cookie value
const getCookie = (name) => {
  if (
    typeof document === "undefined" ||
    typeof document.cookie === "undefined"
  ) {
    return null; // Do nothing if not in a browser environment
  }
  const cookieName = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

async function detectAndLogCurrency(
  defaultCurrency = "INR",
  defaultAmount = 4100
) {
  try {
    // First check if we have currency and amount stored in cookies
    const cookieCurrency = getCookie("currency");
    const cookieAmount = getCookie("amount");

    if (cookieCurrency && cookieAmount) {
      console.log(
        `Using cookie data - Currency: ${cookieCurrency}, Amount: ${cookieAmount}`
      );
      return { currency: cookieCurrency, amount: Number(cookieAmount) };
    }
    console.log("No cookie data found, fetching HTML document...");
    // If no cookie data, fetch the HTML document
    const fetchFn =
      typeof fetch !== "undefined"
        ? fetch
        : (...args) =>
            import("node-fetch").then(({ default: f }) => f(...args));
    const docRes = await fetchFn(
      "https://learnyard.tagmango.ai/web/checkout/67d5266b4bbcba673b8818d1"
    );
    console.log("HTML document fetched successfully.");
    const html = await docRes.text();

    const usdAmount = getAmount(html, /usdAmount\\":\s*(\d+)/);
    const eurAmount = getAmount(html, /eurAmount\\":\s*(\d+)/);
    const inrAmount = getAmount(html, /inrAmount\\":\s*(\d+)/);

    // Check if country is available in cookie
    let country = getCookie("user_country");
    console.log("Country from cookie:", country);

    if (!country) {
      // If country not available in cookie, fetch it
      console.log("Fetching country through IP...");
      const countryRes = await fetch(
        "https://api-prod-new.tagmango.com/get-country-through-ip"
      );
      console.log("Country fetched successfully.");
      const data = await countryRes.json();
      const result = JSON.parse(data.result);
      console.log("Country fetched:", result);
      country = result.country;
      console.log(`Detected country: ${country}`);

      // Store country in cookie for 1 day (24 * 60 minutes)
      setCookie("user_country", country, 24 * 60);
    } else {
      console.log(`Using country from cookie: ${country}`);
    }

    // Match country to currency
    let currency, amount;
    if (usdAmount != null && country === "United States") {
      currency = "USD";
      amount = usdAmount;
    } else if (inrAmount != null && country === "India") {
      currency = "INR";
      amount = inrAmount;
    } else if (
      eurAmount != null &&
      [
        "Germany",
        "France",
        "Spain",
        "Italy",
        "The Netherlands",
        "Belgium",
        "Austria",
        "Finland",
        "Ireland",
        "Portugal",
        "Greece",
        "Slovakia",
        "Slovenia",
        "Estonia",
        "Latvia",
        "Lithuania",
        "Luxembourg",
        "Malta",
        "Cyprus",
      ].includes(country)
    ) {
      currency = "EUR";
      amount = eurAmount;
    } else {
      currency = defaultCurrency;
      amount = defaultAmount;
    }

    setCookie("currency", currency, 10);
    setCookie("amount", amount, 10);

    console.log(`Currency: ${currency}, Amount: ${amount}`);
    return { currency, amount };
  } catch (e) {
    console.error("Error:", e.message);
    console.log(`Currency: ${defaultCurrency}, Amount: ${defaultAmount}`);
    return { currency: defaultCurrency, amount: defaultAmount };
  }
}

detectAndLogCurrency().then(({ currency, amount }) => {
  const el = document.getElementById("currency-result");
  if (el) el.textContent = `Currency: ${currency}, Amount: ${amount}`;
});

// let country = "The Netherlands";
// let arr = ["The Netherlands"].includes(country);
// console.log("Is country in EUR list?", arr);
