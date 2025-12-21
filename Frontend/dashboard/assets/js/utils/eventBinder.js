/**
 * Event Binder Helper - Giải quyết vấn đề trùng lặp event listeners
 * Khi page được load lại, element cũ được xóa và element mới được tạo
 * Hàm này giúp bind event listener một cách an toàn
 */

export function rebindElements(selectors) {
  /**
   * selectors: Object với format {elementId: handler}
   * VD: { 'myBtn': () => console.log('clicked') }
   */
  Object.entries(selectors).forEach(([id, handler]) => {
    const elem = document.getElementById(id);
    if (!elem) return;
    
    // Clone element để remove old listeners
    const newElem = elem.cloneNode(true);
    elem.parentNode.replaceChild(newElem, elem);
    
    // Bind new listener
    if (typeof handler === 'function') {
      newElem.addEventListener('click', handler);
    } else if (typeof handler === 'object' && handler.event) {
      newElem.addEventListener(handler.event, handler.handler);
    }
  });
}

export function rebindElement(id, handler, event = 'click') {
  const elem = document.getElementById(id);
  if (!elem) return false;
  
  // Clone element để remove old listeners
  const newElem = elem.cloneNode(true);
  elem.parentNode.replaceChild(newElem, elem);
  
  // Bind new listener
  newElem.addEventListener(event, handler);
  return true;
}

export function rebindForm(formId, submitHandler) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  // Clone form để remove old listeners
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  
  // Bind new listener
  newForm.addEventListener('submit', submitHandler);
  return true;
}

export function bindChangeEvent(id, handler) {
  const elem = document.getElementById(id);
  if (!elem) return false;
  
  // Clone element để remove old listeners
  const newElem = elem.cloneNode(true);
  elem.parentNode.replaceChild(newElem, elem);
  
  // Bind new listener
  newElem.addEventListener('change', handler);
  return true;
}

export function bindInputEvent(id, handler, debounceMs = 0) {
  const elem = document.getElementById(id);
  if (!elem) return false;
  
  // Clone element để remove old listeners
  const newElem = elem.cloneNode(true);
  elem.parentNode.replaceChild(newElem, elem);
  
  // Bind new listener với debounce nếu cần
  if (debounceMs > 0) {
    let timeoutId;
    newElem.addEventListener('input', (e) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(e), debounceMs);
    });
  } else {
    newElem.addEventListener('input', handler);
  }
  return true;
}
