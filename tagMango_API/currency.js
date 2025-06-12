const USE_MOCK_COUNTRY = true;
const MOCK_COUNTRY = "Germany";

const getAmount = (str, regex) => {
  const match = str.match(regex);
  if (match) {
    return Number(match[1]);
  }
  return null;
};

const setCookie = (name, value, minutesToExpire) => {
  if (typeof document === "undefined" || typeof document.cookie === "undefined") {
    return;
  }
  const date = new Date();
  date.setTime(date.getTime() + minutesToExpire * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name) => {
  if (typeof document === "undefined" || typeof document.cookie === "undefined") {
    return null;
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

async function detectAndLogCurrency(defaultCurrency = "INR", defaultAmount = 4100) {
  try {
    const resultEl = document.getElementById("result");

    const cookieCurrency = getCookie("currency");
    const cookieAmount = getCookie("amount");

    if (cookieCurrency && cookieAmount) {
      resultEl.textContent = `Using cookie data - Currency: ${cookieCurrency}, Amount: ${cookieAmount}`;
      return { currency: cookieCurrency, amount: Number(cookieAmount) };
    }

    const docRes = await fetch("https://learnyard.tagmango.ai/web/checkout/67d5266b4bbcba673b8818d1");
    const html = await docRes.text();

    const usdAmount = getAmount(html, /usdAmount\\":\s*(\d+)/);
    const eurAmount = getAmount(html, /eurAmount\\":\s*(\d+)/);
    const inrAmount = getAmount(html, /inrAmount\\":\s*(\d+)/);

    let country = getCookie("user_country");

    if (!country) {
      if (USE_MOCK_COUNTRY) {
        country = MOCK_COUNTRY;
        console.log(`Mocking country as: ${country}`);
      } else {
        const countryRes = await fetch("https://api-prod-new.tagmango.com/get-country-through-ip");
        const data = await countryRes.json();
        const result = JSON.parse(data.result);
        country = result.country;
      }
      setCookie("user_country", country, 24 * 60);
    }

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
        "Germany", "France", "Spain", "Italy", "Netherlands", "Belgium", "Austria",
        "Finland", "Ireland", "Portugal", "Greece", "Slovakia", "Slovenia", "Estonia",
        "Latvia", "Lithuania", "Luxembourg", "Malta", "Cyprus",
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

    resultEl.textContent = `Currency: ${currency}, Amount: ${amount}`;
    return { currency, amount };
  } catch (e) {
    console.error("Error:", e.message);
    document.getElementById("result").textContent = `Currency: ${defaultCurrency}, Amount: ${defaultAmount}`;
    return { currency: defaultCurrency, amount: defaultAmount };
  }
}

detectAndLogCurrency();
