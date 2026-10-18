(() => {
  const priceInput = document.getElementById('price');
  const currencyDropdown = document.getElementById('currencyDropdown');
  const verdictEmoji = document.getElementById('verdict-emoji');
  const verdictTitle = document.getElementById('verdict-title');
  const verdictDescription = document.getElementById('verdict-description');
  const ruleNote = document.getElementById('rule-note');
  const suggestion = document.getElementById('coin-suggestion');
  const suggestionText = document.getElementById('suggestion-text');
  const coin = document.getElementById('coin');
  const coinResult = document.getElementById('coin-result');
  const flipButton = document.getElementById('flip-button');
  const suggestFlip = document.getElementById('suggest-flip');
  const conversionNote = document.getElementById('conversion-note');
  const tripStamp = document.getElementById('trip-stamp');
  let flipping = false;

  const tiers = [
    { max: 1, emoji: '✅', title: 'Get it!', description: "It's cheap enough. Don't overthink it.", note: 'Under S$1', recommend: false },
    { max: 2, emoji: '😊', title: 'If you like it, get it.', description: 'A little treat is fine! If it makes you smile, go for it.', note: 'S$1 to under S$2', recommend: false },
    { max: 5, emoji: '🤔', title: 'Only if you REALLY like it.', description: 'Would you still want it tomorrow, or is the holiday excitement talking?', note: 'S$2 to under S$5', recommend: true },
    { max: 10, emoji: '🧐', title: 'Is it worth it?', description: 'Is it unique? Would it make a good souvenir?', note: 'S$5 to under S$10', recommend: true },
    { max: 20, emoji: '🥺', title: 'Think very carefully.', description: 'Do you REALLYYYYY like it? Will you regret leaving it behind?', note: 'S$10 to under S$20', recommend: true },
    { max: 50, emoji: '😵', title: 'It\'s Expensive but....', description: 'Its Expensive but you like it! Worth it, memorable, and not easily found elsewhere. Make it count!', note: 'S$20 to under S$50', recommend: true },
    { max: Infinity, emoji: '🚨', title: 'Special case only!', description: 'Its WAYYY too Expensive! Only get it if it\'s truly special.', note: 'S$50+ Special case only', recommend: true }
  ];

  const holidayConfig = {
    locationName: 'Hong Kong',
    currencyCode: 'HKD',
    currencySymbol: 'HK$',
    exchangeRate: 6 // Foreign currency per S$1
  };

  // Update conversion note and trip stamp
  conversionNote.textContent = `Approx. ${holidayConfig.currencySymbol}${holidayConfig.exchangeRate} = S$1. Rates are for quick decisions, not exact conversion.`;
  tripStamp.textContent = `📍 ${holidayConfig.currencyCode} edition`;

  // Populate currency dropdown
  const currencies = [
    { value: 'SGD', label: 'SGD (S$)' },
    {
      value: holidayConfig.currencyCode,
      label: `${holidayConfig.currencyCode} (${holidayConfig.currencySymbol})`
    }
  ];

  currencies.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency.value;
    option.textContent = currency.label;
    currencyDropdown.appendChild(option);
  });

  function formatMoney(value, currency) {
    return (currency === 'SGD' ? 'S$' : holidayConfig.currencySymbol) + value.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function updateVerdict() {
    const raw = priceInput.value.trim();
    if (raw === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0) {
      verdictEmoji.textContent = '🛍️';
      verdictTitle.textContent = 'Ready when you are!';
      verdictDescription.textContent = 'Enter a price above and I\'ll help you decide.';
      ruleNote.textContent = 'Your holiday rules, no judgement. 💕';
      suggestion.classList.remove('show');
      return;
    }
    const amount = Number(raw);
    const sgd = currencyDropdown.value === 'SGD' ? amount : amount / holidayConfig.exchangeRate;
    const holidayAmount = currencyDropdown.value === holidayConfig.currencyCode ? amount : amount * holidayConfig.exchangeRate;
    const tier = tiers.find(item => sgd < item.max) || tiers[tiers.length - 1];
    verdictEmoji.textContent = tier.emoji;
    verdictTitle.textContent = tier.title;
    verdictDescription.textContent = tier.description;
    ruleNote.textContent = `${tier.note} · About ${formatMoney(sgd, 'SGD')} / ${formatMoney(holidayAmount, holidayConfig.currencyCode)}`;
    suggestion.classList.toggle('show', tier.recommend);
    if (tier.recommend) {
      suggestionText.textContent = sgd < 5
        ? 'You really like it, but still on the fence? Flip a coin to break the tie.'
        : sgd < 10
          ? 'After checking if it is worth it and unique, flip if you still cannot decide.'
          : 'Only flip after it passes your careful-thinking test. The coin cannot approve an over-budget purchase!';
    }
  }
  priceInput.addEventListener('input', updateVerdict);
  currencyDropdown.addEventListener('change', updateVerdict);

  function flipCoin() {
    if (flipping) return;
    flipping = true;
    flipButton.disabled = true;
    suggestFlip.disabled = true;
    coin.classList.remove('flipping');
    void coin.offsetWidth;
    coin.classList.add('flipping');
    coin.textContent = '✦';
    coinResult.textContent = 'Flipping...';
    window.setTimeout(() => {
      const heads = Math.random() < 0.5;
      coin.textContent = heads ? 'H' : 'T';
      coin.setAttribute('aria-label', heads ? 'Heads' : 'Tails');
      coinResult.textContent = heads ? '🛍️ Heads! GET IT!' : '👋 Tails! LEAVE IT!';
      coin.classList.remove('flipping');
      flipButton.disabled = false;
      suggestFlip.disabled = false;
      flipping = false;
    }, 680);
  }
  flipButton.addEventListener('click', flipCoin);
  suggestFlip.addEventListener('click', flipCoin);

  document.getElementById('number-button').addEventListener('click', () => {
    const minRaw = document.getElementById('minimum').value;
    const maxRaw = document.getElementById('maximum').value;
    const min = Number(minRaw);
    const max = Number(maxRaw);
    const output = document.getElementById('number-value');
    const caption = document.getElementById('number-caption');
    if (minRaw.trim() === '' || maxRaw.trim() === '' || !Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) {
      output.textContent = '?!';
      caption.textContent = 'Please enter whole numbers, with From no greater than To.';
      return;
    }
    if (max - min > 1000000000) {
      output.textContent = '?!';
      caption.textContent = 'That range is a little too big — try a smaller one.';
      return;
    }
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    output.textContent = String(number);
    caption.textContent = `Your number from ${min} to ${max}`;
  });
  updateVerdict();
})();
