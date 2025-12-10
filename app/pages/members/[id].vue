<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Edit Data Anggota
      </h1>
      <UButton to="/members" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Data Identitas -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Data Identitas
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">
                Nomor Induk Internal <span class="text-red-500">*</span>
              </label>
              <input v-model="form.id_local" type="text" required placeholder="Masukkan nomor induk"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <input v-model="form.name" type="text" required placeholder="Masukkan nama lengkap"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Jenis Identitas</label>
              <select v-model="form.id_type" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="">Pilih Jenis</option>
                <option value="KTP">KTP</option>
                <option value="KIA">KIA</option>
                <option value="KITAS">KITAS</option>
                <option value="KITAP">KITAP</option>
                <option value="Paspor">Paspor</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Nomor Identitas</label>
              <input v-model="form.id_number" type="text" placeholder="Masukkan nomor identitas"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>
          </div>
        </div>

        <!-- Data Kelahiran -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Data Kelahiran
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Tanggal Lahir</label>
              <input v-model="form.dob" type="date" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Tempat Lahir</label>
              <input v-model="form.pob" type="text" placeholder="Kota" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Kewarganegaraan</label>
              <select v-model="form.nationality" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="" disabled>Pilih kewarganegaraan</option>
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Suku / Bangsa</label>
              <input v-model="form.ethnic" type="text" placeholder="Masukkan suku"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Jenis Kelamin</label>
              <select v-model="form.sex" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="">Pilih</option>
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Golongan Darah</label>
              <select v-model="form.blood" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="" disabled>Pilih golongan darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Kontak -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Informasi Kontak
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Nomor Telepon</label>
              <input v-model="form.phone" type="tel" placeholder="08123456789"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Alamat Email</label>
              <input v-model="form.email" type="email" placeholder="email@example.com"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>
          </div>

          <div class="mt-4">
            <label class="block mb-2 text-sm font-semibold">Alamat Jalan dan Nomor</label>
            <textarea v-model="form.address" placeholder="Masukkan alamat lengkap" rows="3"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"></textarea>
          </div>

          <div class="mt-4 relative city-dropdown-container">
            <label class="block mb-2 text-sm font-semibold">Kota & Provinsi</label>

            <div>
              <input v-model="citySearch" @focus="dropdownOpen = true" @input="dropdownOpen = true" type="text"
                placeholder="Pilih atau cari kota..." class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div v-if="dropdownOpen" class="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg shadow-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
              <div v-for="c in filteredCities" :key="c.id" @click.stop="selectCity(c)"
                class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                {{ c.name }} - {{ c.province_name }}
              </div>

              <div v-if="filteredCities.length === 0" class="px-3 py-2 text-sm text-gray-500">
                Tidak ada hasil
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Koordinat Latitude</label>
              <input v-model="form.latitude" type="text" placeholder="-6.200000"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Koordinat Longitude</label>
              <input v-model="form.longitude" type="text" placeholder="106.816666"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>
          </div>
        </div>

        <!-- Foto -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Foto Anggota
          </h2>

          <div>
            <label class="block mb-2 text-sm font-semibold">Upload Foto</label>
            <input type="file" accept="image/*" @change="onPhotoChange" class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            <div v-if="photoPreview" class="mt-3">
              <img :src="photoPreview" alt="Foto Preview" class="h-32 w-32 object-cover rounded-lg border"
                style="border-color: var(--ui-border);" />
            </div>
          </div>
        </div>

        <!-- Data Keluarga -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Data Keluarga & Agama
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Nomor Kartu Keluarga (KK)</label>
              <input v-model="form.family_id" type="text" placeholder="Masukkan nomor KK (16 digit)" maxlength="16"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Hubungan Keluarga</label>
              <select v-model="form.family_relation" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="">Pilih</option>
                <option>Kepala Keluarga</option>
                <option>Ayah</option>
                <option>Ibu</option>
                <option>Suami</option>
                <option>Istri</option>
                <option>Anak</option>
                <option>Menantu</option>
                <option>Cucu</option>
                <option>Orangtua</option>
                <option>Mertua</option>
                <option>Famili Lain</option>
                <option>Pembantu</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Status Perkawinan</label>
              <select v-model="form.marriage" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="">Pilih</option>
                <option value="belum kawin">Belum Kawin</option>
                <option value="kawin">Kawin</option>
                <option value="cerai hidup">Cerai Hidup</option>
                <option value="cerai mati">Cerai Mati</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Agama</label>
              <select v-model="form.religion" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="">Pilih</option>
                <option>Islam</option>
                <option>Kristen</option>
                <option>Katolik</option>
                <option>Hindu</option>
                <option>Buddha</option>
                <option>Konghucu</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">
                Status Kehidupan <span class="text-red-500">*</span>
              </label>
              <select v-model="form.is_deceased" required class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="0">Masih Hidup</option>
                <option value="1">Sudah Meninggal</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">
                Status Keanggotaan <span class="text-red-500">*</span>
              </label>
              <select v-model="form.is_active" required class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="1">Aktif</option>
                <option value="0">Tidak Aktif / Keluar</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Daftar Anggota KK Sendiri -->
        <div v-if="familyMembers.length > 0" class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-3" style="color: var(--ui-text-highlighted);">
            Anggota Dalam Kartu Keluarga Ini ({{ form.family_id }})
          </h2>

          <div class="space-y-3">
            <div v-for="member in familyMembers" :key="member.id" class="p-3 rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
              <div class="font-semibold text-sm">
                {{ member.name }}
              </div>

              <div class="text-xs opacity-80 mt-1 leading-relaxed">
                • NIK: {{ member.id_local }}<br />
                • Hubungan: <b>{{ member.family_relation }}</b><br />
                • Status:
                <span v-if="member.is_deceased == 1" class="text-red-500">Meninggal</span>
                <span v-else class="text-green-500">Hidup</span>
                • Keanggotaan:
                <span v-if="member.is_active == 1" class="text-green-500">Aktif</span>
                <span v-else class="text-gray-500">Tidak Aktif</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================= -->
        <!-- LINK KK ANTAR MEMBER -->
        <!-- ========================= -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Hubungkan Kartu Keluarga
          </h2>

          <!-- No KK saat ini -->
          <div class="mb-4">
            <label class="block mb-2 text-sm font-semibold">No KK Sekarang:</label>
            <input v-model="form.family_id" disabled class="w-full px-3 py-2 text-sm rounded-lg opacity-60"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          </div>

          <!-- No KK yang mau di-link -->
          <div class="mb-4">
            <label class="block mb-2 text-sm font-semibold">Hubungkan ke No KK:</label>
            <input v-model="relationForm.nokkLink" placeholder="Masukkan No KK lain (16 digit)" maxlength="16"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          </div>

          <!-- Tombol Sambung & Refresh -->
          <div class="flex gap-2">
            <UButton color="blue" @click="handleLinkKK" :disabled="!relationForm.nokkLink" icon="i-heroicons-link">
              Sambungkan No KK
            </UButton>

            <UButton color="gray" variant="soft" @click="loadLinkedKKs" icon="i-heroicons-arrow-path">
              Refresh Daftar KK Terhubung
            </UButton>
          </div>
        </div>

        <!-- ========================= -->
        <!-- TAMPILKAN KK YANG TERHUBUNG -->
        <!-- ========================= -->
        <div v-if="linkedKKs.length > 0" class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-3" style="color: var(--ui-text-highlighted);">
            Kartu Keluarga yang Terhubung
          </h2>

          <div class="space-y-5">
            <div v-for="kkGroup in linkedKKs" :key="kkGroup.nokk" class="p-4 rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);">

              <!-- Header tiap KK -->
              <div class="mb-3 pb-2 border-b" style="border-color: var(--ui-border);">
                <div class="font-semibold text-base">
                  KK: {{ kkGroup.nokk }}
                </div>
                <div class="text-xs opacity-70 mt-1">
                  Total {{ kkGroup.members?.length || 0 }} anggota
                </div>
              </div>

              <!-- Daftar member -->
              <div v-if="kkGroup.members && kkGroup.members.length > 0" class="space-y-3">
                <div v-for="member in kkGroup.members" :key="member.id" class="p-3 rounded-lg"
                  style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                  <div class="font-semibold text-sm">
                    {{ member.name }}
                  </div>

                  <div class="text-xs opacity-80 mt-1 leading-relaxed">
                    • NIK: {{ member.id_local }}<br />
                    • Hubungan: <b>{{ member.family_relation }}</b><br />
                    • Status:
                    <span v-if="member.is_deceased == 1" class="text-red-500">Meninggal</span>
                    <span v-else class="text-green-500">Hidup</span>
                    • Keanggotaan:
                    <span v-if="member.is_active == 1" class="text-green-500">Aktif</span>
                    <span v-else class="text-gray-500">Tidak Aktif</span>
                  </div>
                </div>
              </div>

              <div v-else class="text-sm opacity-60 text-center py-2">
                Tidak ada data anggota dalam KK ini
              </div>

            </div>
          </div>
        </div>


        <!-- Hubungan Keluarga Lainnya -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Hubungan Keluarga Lainnya
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">NIK</label>
              <input v-model="relationForm.nik" type="text" placeholder="Masukkan NIK"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Nama</label>
              <input v-model="relationForm.name" type="text" placeholder="Masukkan Nama"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Hubungan</label>
              <select v-model="relationForm.relationType" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
                <option value="">Pilih hubungan</option>
                <option value="ayah">Ayah</option>
                <option value="ibu">Ibu</option>
                <option value="anak">Anak</option>
                <option value="pasangan">Suami/Istri</option>
                <option value="saudara">Saudara Kandung</option>
                <option value="kakek_nenek">Kakek/Nenek</option>
                <option value="paman_bibi">Paman/Bibi</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <UButton :disabled="!isRelationFormValid" @click="addRelation" color="primary"
              icon="i-heroicons-plus-circle" label="Tambah Hubungan Keluarga" />
          </div>

          <!-- List Hubungan yang Sudah Ditambahkan -->
          <div v-if="familyRelations.length > 0" class="space-y-2 mt-4">
            <h3 class="text-sm font-semibold mb-2">Daftar Hubungan Keluarga:</h3>
            <div v-for="(item, i) in familyRelations" :key="i" class="flex justify-between items-center p-3 rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
              <div class="text-sm flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">{{ item.name }}</span>
                  <span v-if="item.id"
                    class="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    Tersimpan
                  </span>
                  <span v-else
                    class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                    Baru
                  </span>
                </div>
                <div class="text-xs opacity-80 mt-1">
                  NIK: {{ item.nik }} • Hubungan: {{ getRelationLabel(item.relationType) }}
                </div>
              </div>
              <UButton color="red" variant="soft" size="sm" icon="i-heroicons-trash" @click="removeRelation(i)" />
            </div>
          </div>
        </div>

        <!-- Data Baptis -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Data Baptis
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Tanggal Baptis</label>
              <input v-model="form.baptist_date" type="date" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Gereja Tempat Baptis</label>
              <input v-model="form.baptist_place" type="text" placeholder="Nama gereja"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>
          </div>

          <div class="mt-4">
            <label class="block mb-2 text-sm font-semibold">Nama Pendeta yang Membaptis</label>
            <input v-model="form.baptist_host_name" type="text" placeholder="Nama pendeta"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          </div>
        </div>

        <!-- Data Sidi -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Data Sidi
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Tanggal Sidi</label>
              <input v-model="form.consecrate_date" type="date" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Gereja Tempat Sidi</label>
              <input v-model="form.consecrate_place" type="text" placeholder="Nama gereja"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>
          </div>

          <div class="mt-4">
            <label class="block mb-2 text-sm font-semibold">Nama Pendeta yang Mensidi</label>
            <input v-model="form.consecrate_host_name" type="text" placeholder="Nama pendeta"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          </div>
        </div>

        <!-- Data Jemaat -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Data Keanggotaan Jemaat
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Tanggal Menjadi Jemaat</label>
              <input v-model="form.attest_date" type="date" class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Gereja Sebelumnya</label>
              <input v-model="form.attest_origin" type="text" placeholder="Nama gereja asal"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;">
          {{ serverError }}
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle"
            :label="saving ? 'Mengupdate...' : 'Update Data Anggota'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Batal"
            @click="router.push('/members')" />
        </div>
      </form>
    </UCard>

    <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex items-start gap-3">
        <span class="text-blue-400 text-lg">ℹ️</span>
        <div class="text-sm">
          <p class="font-semibold mb-1">Informasi:</p>
          <p>
            Field dengan <span class="text-red-500">*</span> wajib diisi.
            Pastikan semua data sudah benar sebelum menyimpan.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useMembers } from "~/composables/useMembers"
import { useCities } from "~/composables/useCity"
import { useAuxiliaryPersons } from "~/composables/useAuxiliaryPersons"
import { useKkLinks } from '~/composables/useKkLinks'

const router = useRouter()
const route = useRoute()
const memberId = route.params.id as string

const { member, fetchById, update, familyMembers, fetchByKK } = useMembers()
const { cities, fetchAll: fetchCities } = useCities()
const { connectKK, getFamilyMembers, getConnectedKKs } = useKkLinks()

const {
  persons,
  fetchByMember: fetchAuxByMember,
  create: createAuxPerson,
  remove: removeAuxPerson
} = useAuxiliaryPersons()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

// FORM STATE
const form = reactive({
  id_local: "",
  id_type: "",
  id_number: "",
  name: "",
  dob: "",
  pob: "",
  nationality: "",
  ethnic: "",
  sex: "",
  phone: "",
  email: "",
  address: "",
  city: null as number | null,
  latitude: "",
  longitude: "",
  photo: null as File | null,
  marriage: "",
  is_deceased: "0",
  is_active: "1",
  family_id: "",
  family_relation: "",
  religion: "",
  blood: "",
  baptist_date: "",
  baptist_place: "",
  baptist_host_name: "",
  consecrate_date: "",
  consecrate_place: "",
  consecrate_host_name: "",
  attest_date: "",
  attest_origin: ""
})

const photoPreview = ref<string | null>(null)

// FAMILY RELATIONS STATE
const familyRelations = ref<any[]>([])
const linkedKKs = ref<any[]>([])

const relationForm = reactive({
  nik: "",
  name: "",
  relationType: "",
  nokkLink: ""
})

// =======================
// LOAD LINKED KKs
// =======================
const loadLinkedKKs = async () => {
  if (!form.family_id) {
    console.warn('⚠️ loadLinkedKKs: No family_id provided')
    return
  }

  try {
    console.log('🚀 Loading linked KKs for:', form.family_id)

    // Ambil array No KK yang terhubung
    const connectedKKs = await getConnectedKKs(form.family_id)
    console.log('📦 Raw Connected KKs Response:', connectedKKs)

    if (!connectedKKs || connectedKKs.length === 0) {
      console.log('❌ No connected KKs found')
      linkedKKs.value = []
      return
    }

    // FILTER: Buang KK sendiri dari list
    const currentKK = String(form.family_id).trim()
    const otherKKs = connectedKKs.filter((nokk: string) => {
      const nokkStr = String(nokk).trim()
      const isDifferent = nokkStr !== currentKK
      console.log(`🔍 Comparing: "${nokkStr}" vs "${currentKK}" -> ${isDifferent ? 'DIFFERENT ✅' : 'SAME ❌'}`)
      return isDifferent
    })

    console.log('🎯 Other KKs (excluding current):', otherKKs)

    if (otherKKs.length === 0) {
      console.log('ℹ️ No other KKs found (only current KK in the list)')
      linkedKKs.value = []
      return
    }

    // Untuk setiap KK LAIN, ambil semua membernya dan FILTER yang sesuai KK-nya
    const kkPromises = otherKKs.map(async (nokk: string, index: number) => {
      const nokkString = String(nokk).trim()
      console.log(`🔄 [${index}] Processing KK:`, nokkString)

      try {
        const familyData = await getFamilyMembers(nokkString)
        console.log(`✅ [${index}] Raw family data for KK ${nokkString}:`, familyData)

        // PENTING: Filter hanya member yang family_id-nya sama dengan nokk ini
        const filteredMembers = (familyData?.members || []).filter((member: any) => {
          const memberKK = String(member.family_id || '').trim()
          const matchesKK = memberKK === nokkString

          console.log(`  👤 ${member.name}: family_id="${memberKK}" vs nokk="${nokkString}" -> ${matchesKK ? '✅ MATCH' : '❌ NO MATCH'}`)

          return matchesKK
        })

        console.log(`✅ [${index}] Filtered members for KK ${nokkString}:`, filteredMembers.length, 'members')

        return {
          nokk: nokkString,
          members: filteredMembers
        }
      } catch (err) {
        console.error(`❌ [${index}] Gagal load members untuk KK ${nokk}:`, err)
        return {
          nokk: nokkString,
          members: []
        }
      }
    })

    linkedKKs.value = await Promise.all(kkPromises)
    console.log('🎯 Final Linked KKs with filtered members:', linkedKKs.value)

  } catch (err) {
    console.error('💥 Gagal load linked KKs:', err)
    linkedKKs.value = []
  }
}

// =======================
// ON MOUNT
// =======================
onMounted(async () => {
  loading.value = true
  serverError.value = null

  try {
    await fetchCities()
    await fetchById(memberId)

    const data = member.value
    if (!data) {
      serverError.value = "Data anggota tidak ditemukan."
      return
    }

    Object.keys(form).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        form[key] = data[key]
      }
    })

    if (typeof data.city === "object" && data.city !== null) {
      form.city = data.city.id
    }

    if (data.photo) {
      photoPreview.value = data.photo
    }

    if (data.family_id) {
      await fetchByKK(data.family_id)
      await loadLinkedKKs()
    }

    const auxData = await fetchAuxByMember(memberId)
    if (auxData && Array.isArray(auxData)) {
      familyRelations.value = auxData.map(p => ({
        id: p.id,
        nik: p.id_local,
        name: p.name,
        relationType: p.family_relation || ''
      }))
    }

  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data anggota."
  } finally {
    loading.value = false
  }

  document.addEventListener('click', handleClickOutside)
})

// =======================
// HANDLE LINK KK
// =======================
const handleLinkKK = async () => {
  if (!relationForm.nokkLink || !form.family_id) {
    alert("Mohon isi No KK yang akan dihubungkan")
    return
  }

  if (relationForm.nokkLink === form.family_id) {
    alert("Tidak bisa menghubungkan KK dengan dirinya sendiri")
    return
  }

  try {
    await connectKK(form.family_id, relationForm.nokkLink)
    await loadLinkedKKs()
    await fetchByKK(form.family_id)

    alert("No KK berhasil disambungkan!")
    relationForm.nokkLink = ""
  } catch (err: any) {
    console.error('Error linking KK:', err)
    alert(err?.data?.message || "Gagal menghubungkan KK")
  }
}

// =======================
// ADD RELATION
// =======================
const addRelation = () => {
  if (!relationForm.nik || !relationForm.name || !relationForm.relationType) {
    return
  }

  familyRelations.value.push({
    id: null,
    nik: relationForm.nik,
    name: relationForm.name,
    relationType: relationForm.relationType
  })

  relationForm.nik = ""
  relationForm.name = ""
  relationForm.relationType = ""
}

// =======================
// REMOVE RELATION
// =======================
const removeRelation = async (index: number) => {
  const relation = familyRelations.value[index]

  if (relation.id) {
    try {
      await removeAuxPerson(relation.id)
    } catch (err) {
      console.error('Gagal menghapus relasi:', err)
      serverError.value = 'Gagal menghapus hubungan keluarga'
      return
    }
  }

  familyRelations.value.splice(index, 1)
}

// =======================
// SAVE
// =======================
const save = async () => {
  saving.value = true
  serverError.value = null

  try {
    const formData = new FormData()

    Object.keys(form).forEach((key) => {
      const v = (form as any)[key]

      if (key === 'photo') {
        if (v instanceof File) {
          formData.append('photo', v)
        }
        return
      }

      if (v !== null && v !== "") {
        formData.append(key, v)
      }
    })

    await update(memberId, formData)

    for (const relation of familyRelations.value) {
      if (relation.id) continue

      await createAuxPerson({
        id_local: relation.nik,
        name: relation.name,
        family_relation: relation.relationType,
        member_id: Number(memberId)
      })
    }

    router.push("/members")

  } catch (err: any) {
    console.error('Save error:', err)
    serverError.value = err?.data?.message || err?.message || "Gagal mengupdate data."
  } finally {
    saving.value = false
  }
}

// =======================
// FOTO PREVIEW
// =======================
const onPhotoChange = (e: any) => {
  const file = e.target.files?.[0] ?? null
  form.photo = file
  if (file) photoPreview.value = URL.createObjectURL(file)
}

// =======================
// CITY DROPDOWN
// =======================
const citySearch = ref('')
const dropdownOpen = ref(false)

const filteredCities = computed(() => {
  if (!cities.value.length) return []
  const s = citySearch.value.toLowerCase()
  if (!s) return cities.value
  return cities.value.filter(c =>
    c.name.toLowerCase().includes(s) ||
    (c.province_name ?? "").toLowerCase().includes(s)
  )
})

const selectCity = (c: any) => {
  form.city = c.id
  citySearch.value = `${c.name} - ${c.province_name}`
  dropdownOpen.value = false
}

watch(() => form.city, (val) => {
  if (!val || !cities.value.length) return
  const found = cities.value.find(c => c.id == val)
  if (found) {
    citySearch.value = `${found.name} - ${found.province_name}`
  }
})

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.city-dropdown-container')) {
    dropdownOpen.value = false
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// =======================
// RELATION OPTIONS
// =======================
const relationTypeOptions = [
  { label: "Ayah", value: "ayah" },
  { label: "Ibu", value: "ibu" },
  { label: "Anak", value: "anak" },
  { label: "Suami/Istri", value: "pasangan" },
  { label: "Saudara Kandung", value: "saudara" },
  { label: "Kakek/Nenek", value: "kakek_nenek" },
  { label: "Paman/Bibi", value: "paman_bibi" },
  { label: "Lainnya", value: "lainnya" }
]

const isRelationFormValid = computed(() => {
  return (
    relationForm.nik.trim() !== "" &&
    relationForm.name.trim() !== "" &&
    relationForm.relationType.trim() !== ""
  )
})

const getRelationLabel = (type: string) => {
  const found = relationTypeOptions.find(opt => opt.value === type)
  return found ? found.label : type
}
</script>
