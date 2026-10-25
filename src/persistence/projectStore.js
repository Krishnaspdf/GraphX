export function saveProject(data) {
  localStorage.setItem('graphx_project', JSON.stringify(data));
  return true;
}

export function loadProject() {
  const raw = localStorage.getItem('graphx_project');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function exportURLState(state) {
  return btoa(JSON.stringify(state));
}

export function importURLState(b64) {
  try {
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}
