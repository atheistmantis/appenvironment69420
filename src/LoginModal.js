import { signIn } from './auth.js';

/**
 * LoginModal – a <dialog>-based modal for admin sign-in.
 *
 * @param {() => void} onSuccess  – called when login succeeds
 * @returns {{ dialog: HTMLDialogElement, open: () => void, close: () => void }}
 */
export function LoginModal(onSuccess) {
  const dialog = document.createElement('dialog');
  dialog.className = 'login-modal';
  dialog.setAttribute('aria-labelledby', 'login-title');
  dialog.setAttribute('aria-modal', 'true');

  dialog.innerHTML = `
    <form class="login-modal__form" method="dialog" novalidate>
      <h2 id="login-title" class="login-modal__title">Admin Sign In</h2>

      <div class="login-modal__field">
        <label for="login-email" class="login-modal__label">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          class="login-modal__input"
          placeholder="admin@example.com"
          required
          autocomplete="email"
        />
      </div>

      <div class="login-modal__field">
        <label for="login-password" class="login-modal__label">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          class="login-modal__input"
          placeholder="••••••••"
          required
          autocomplete="current-password"
        />
      </div>

      <p id="login-error" class="login-modal__error" role="alert" aria-live="polite"></p>

      <div class="login-modal__actions">
        <button type="submit" class="big-btn login-modal__submit">Sign In</button>
        <button type="button" class="login-modal__cancel">Cancel</button>
      </div>
    </form>
  `;

  document.body.appendChild(dialog);

  const form = dialog.querySelector('.login-modal__form');
  const emailInput = dialog.querySelector('#login-email');
  const passwordInput = dialog.querySelector('#login-password');
  const errorEl = dialog.querySelector('#login-error');
  const cancelBtn = dialog.querySelector('.login-modal__cancel');
  const submitBtn = dialog.querySelector('.login-modal__submit');

  function setError(msg) {
    errorEl.textContent = msg;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Signing in…' : 'Sign In';
  }

  // Prevent native dialog form submission from closing on validation failure
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setError('');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
      emailInput.focus();
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      passwordInput.focus();
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      form.reset();
      dialog.close();
      onSuccess();
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  });

  cancelBtn.addEventListener('click', () => {
    form.reset();
    setError('');
    dialog.close();
  });

  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      form.reset();
      setError('');
      dialog.close();
    }
  });

  return {
    dialog,
    open() {
      setError('');
      form.reset();
      dialog.showModal();
      emailInput.focus();
    },
    close() {
      dialog.close();
    },
  };
}
