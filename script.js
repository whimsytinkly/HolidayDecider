(() => {
      const priceInput = document.getElementById('price');
      const currencyInput = document.getElementById('currency');
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
      let flipping = false;

      const tiers = [
        { max: 1, emoji: '✅', title: 'Get it!', description: "It's cheap enough. Don't overthink it.", note: 'Under S$1 · Under HK$6', recommend: false },
        { max: 2, emoji: '😊', title: 'If you like it, get it.', description: 'A little treat is fine! If it makes you smile, go for it.', note: 'S$1 to under S$2 · HK$6 to under HK$12', recommend: false },
        { max: 5, emoji: '🤔', title: 'Only if you REALLY like it.', description: 'Would you still want it tomorrow, or is the holiday excitement talking?', note: 'S$2 to under S$5 · HK$12 to under HK$30', recommend: true },
        { max: 10, emoji: '🧐', title: 'Is it worth it?', description: 'Is it unique? Would it make a good souvenir?', note: 'S$5 to under S$10 · HK$30 to under HK$60', recommend: true },
        { max: 20, emoji: '😵', title: 'Think very carefully.', description: 'Do you REALLYYYYY like it? Will you regret leaving it behind?', note: 'S$10 to under S$20 · HK$60 to under HK$120', recommend: true },
        { max: Infinity, emoji: '🚨', title: 'Special case only!', description: 'Worth it, memorable, and not easily found elsewhere. Make it count!', note: 'S$20+ · HK$120+ · Special case only', recommend: false }
      ];

      function formatMoney(value, currency) {
        return (currency === 'SGD' ? 'S$' : 'HK$') + value.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        const sgd = currencyInput.value === 'SGD' ? amount : amount / 6;
        const hkd = currencyInput.value === 'HKD' ? amount : amount * 6;
        const tier = tiers.find(item => sgd < item.max) || tiers[tiers.length - 1];
        verdictEmoji.textContent = tier.emoji;
        verdictTitle.textContent = tier.title;
        verdictDescription.textContent = tier.description;
        ruleNote.textContent = `${tier.note} · About ${formatMoney(sgd, 'SGD')} / ${formatMoney(hkd, 'HKD')}`;
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
      currencyInput.addEventListener('change', updateVerdict);

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
