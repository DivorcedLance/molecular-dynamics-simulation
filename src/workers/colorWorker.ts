interface AtomData {
  id: string;
  originalColor: string;
}

interface NeighborData {
  id: string;
  neighbors: string[];
}

interface MessageData {
  atoms: AtomData[];
  neighbors: NeighborData[];
}

interface ColorMap {
  [id: string]: string;
}

self.onmessage = (event: MessageEvent<MessageData>) => {
  const { atoms, neighbors } = event.data;

  // Crear un mapa auxiliar para buscar átomos por id
  const atomMap = new Map<string, AtomData>(
    atoms.map(atom => [atom.id, atom])
  );

  // Mapa para almacenar los colores asignados
  const colorMap: ColorMap = {};

  // Set para rastrear qué átomos ya se han procesado
  const processed = new Set<string>();

  // Función para asignar color a un vecindario
  function assignColorToNeighborhood(startId: string) {
    const stack = [startId];
    const visited = new Set<string>();

    let colorToAssign: string | undefined;

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      if (visited.has(currentId)) continue;

      visited.add(currentId);

      const currentAtom = atomMap.get(currentId);
      if (!currentAtom) continue;

      if (!colorToAssign) {
        colorToAssign = currentAtom.originalColor;
      }

      const currentNeighbors = neighbors.find(n => n.id === currentId)?.neighbors || [];
      for (const neighbor of currentNeighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    visited.forEach(atomId => {
      colorMap[atomId] = colorToAssign!;
      processed.add(atomId);
    });
  }

  // Procesar cada átomo en los vecindarios
  neighbors.forEach(({ id }) => {
    if (!processed.has(id)) {
      assignColorToNeighborhood(id);
    }
  });

  // Asignar el color original a los átomos que no tienen vecindario
  atoms.forEach(atom => {
    if (!colorMap[atom.id]) {
      colorMap[atom.id] = atom.originalColor;
    }
  });

  // Enviar el resultado al hilo principal
  postMessage(colorMap);
};

export {};
