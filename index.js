function getUnallottedUsers(bids, totalShares) {
  // 1️⃣ Ordenar por: precio DESC y timestamp ASC
  bids.sort((a, b) => {
 
    if (b[2] !== a[2]) return b[2] - a[2]; // mayor precio primero
    return a[3] - b[3]; // menor timestamp primero
  });

  console.table(bids);

  // 2️⃣ Crear un Map para registrar asignaciones por usuario
  const allocations = new Map();
  for (const [userId] of bids) {
    allocations.set(userId, 0);
  }

  // 3️⃣ Asignar acciones mientras haya disponibles
  for (const [userId, qty, price, ts] of bids) {
    if (totalShares <= 0) break;

    const allocatable = Math.min(qty, totalShares);
    console.log(`Asignando ${allocatable} acciones a usuario ${userId} (ofertó $${price})`);
    allocations.set(userId, allocations.get(userId) + allocatable);
    totalShares -= allocatable;
  }

  // 4️⃣ Determinar los usuarios que no recibieron acciones
  const unallotted = [];
  for (const [userId, allocated] of allocations) {
    if (allocated === 0) unallotted.push(userId);
  }

  // 5️⃣ Devolver en orden ascendente
  return unallotted.sort((a, b) => a - b);
}

// 🧪 Ejemplo de prueba
const bids = [
  [1, 5, 5, 0],  // user 1: 5 acciones a $5
  [2, 7, 5, 1],  // user 2: 7 acciones a $5
  [3, 5, 4, 2]   // user 3: 5 acciones a $4
];
const totalShares = 10;

console.log(getUnallottedUsers(bids, totalShares));
// ➜ [3]
