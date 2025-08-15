<template>
  <div class="p-6 form-container">
    <BackButton :fixed="true" />
    <!-- :direction="!overallStore.isDesktop ? 'vertical' : 'horizontal'" -->
    <div v-if="editId" class="application_header">
      <span> <strong> ID: </strong> {{ editId }} </span>
      <span>
        <strong> {{ $t('status.txt') }}:</strong> {{ $t(`status.${form.status}`) }}
      </span>
      <span v-if="form.status === 'REJECTED'">
        <strong> {{ $t('status.reason') }}:</strong> {{ form.rejectionReason }}
      </span>
    </div>
    <el-steps :active="activeStep" finish-status="success" direction="horizontal" class="mb-6">
      <el-step :title="overallStore.isDesktop ? $t('first_step') : ''" :icon="Document" />
      <el-step :title="overallStore.isDesktop ? $t('second_step') : ''" :icon="Edit" />
      <el-step :title="overallStore.isDesktop ? $t('third_step') : ''" :icon="CircleCheck" />
    </el-steps>

    <el-form :model="form" :rules="computedRules" ref="formRef" label-position="top">
      <!-- Step 1 -->
      <div v-show="activeStep === 0">
        <div class="grid grid-cols-3 gap-4 section-parent">
          <section class="name-info-section">
            <el-form-item :label="$t('last_name')" prop="lastName">
              <el-input v-model="form.lastName" :placeholder="$t('placeholder_warning')" />
            </el-form-item>
            <el-form-item :label="$t('first_name')" prop="firstName">
              <el-input v-model="form.firstName" :placeholder="$t('placeholder_warning')" />
            </el-form-item>
            <el-form-item :label="$t('middle_name')" prop="middleName">
              <el-input v-model="form.middleName" :placeholder="$t('placeholder_warning')" />
            </el-form-item>
            <el-form-item :label="$t('birth_date')" prop="birthDate">
              <el-date-picker
                v-model="form.birthDate"
                type="date"
                format="DD-MM-YYYY"
                value-format="YYYY-MM-DD"
                :picker-options="{
                  disabledDate(time) {
                    return time.getTime() > Date.now()
                  },
                }"
                @change="form.birthDate = form.birthDate ? form.birthDate : null"
                :placeholder="$t('select_date')"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item :label="$t('passport')" prop="passport">
              <el-input
                v-model="form.passport"
                placeholder="AA-1234567"
                @input="form.passport = form.passport.toUpperCase()"
              />
            </el-form-item>
            <el-form-item :label="$t('gender')" prop="gender">
              <el-select v-model="form.gender" :placeholder="$t('select')">
                <el-option :label="$t('male')" value="male" />
                <el-option :label="$t('female')" value="female" />
              </el-select>
            </el-form-item>
          </section>

          <section>
            <el-form-item :label="$t('issued_by')" prop="issuedBy">
              <el-input v-model="form.issuedBy" :placeholder="$t('issued_by')" />
            </el-form-item>
            <el-form-item :label="$t('issued_date')" prop="issuedDate">
              <el-date-picker
                type="date"
                format="DD-MM-YYYY"
                value-format="YYYY-MM-DD"
                v-model="form.issuedDate"
                placeholder="01-01-2000"
              />
            </el-form-item>
            <el-form-item :label="$t('birth_place')" prop="birthPlace">
              <el-input v-model="form.birthPlace" :placeholder="$t('birth_place_placeholder')" />
            </el-form-item>
            <el-form-item :label="$t('citizenship')" prop="citizenship">
              <el-select v-model="form.citizenship" placeholder="" filterable>
                <el-option
                  v-for="country in countries"
                  :key="country.name"
                  :label="$t(`countries.${country.name}`)"
                  :value="country.name"
                />
              </el-select>
            </el-form-item>
            <!--                        <el-form-item :label="$t('nationality')" prop="nationality">-->
            <!--                            <el-select v-model="form.nationality" placeholder="" filterable>-->
            <!--                                <el-option v-for="nationality in nationalities" :key="nationality.name"-->
            <!--                                    :label="$t(`nationalities.${nationality.name}`)" :value="nationality.name" />-->
            <!--                            </el-select>-->
            <!--                        </el-form-item>-->

            <el-form-item :label="$t('disability')" prop="disability">
              <el-select v-model="form.disability" :placeholder="$t('select')">
                <el-option :label="$t('NO')" value="NO" />
                <el-option :label="$t('YES')" value="YES" />
              </el-select>
            </el-form-item>
          </section>

          <section>
            <el-form-item :label="$t('upload_photo')" prop="photo">
              <el-upload
                class="upload-demo"
                drag
                :auto-upload="false"
                action=""
                :multiple="false"
                accept="image/jpeg,image/jpg"
                :file-list="photoList"
                :on-change="handlePhotoChange"
                :before-upload="beforePhotoUpload"
              >
                <el-icon>
                  <Upload />
                </el-icon>
                <div class="el-upload__text">{{ $t('drag_and_drop_file') }}</div>
              </el-upload>
              <div class="flex justify-center flex-col items-center w-full">
                <p class="text-center">
                  <strong>{{ $t('your_photo') }}</strong>
                </p>
                <p class="text-center">
                  <img
                    v-if="photoPreviewUrl"
                    :src="photoPreviewUrl"
                    alt="Uploaded photo preview"
                    class="max-w-xs rounded user-photo"
                  />
                  <img
                    v-else
                    alt="Образец фото"
                    class="user-photo"
                    src="../../assets/b9a1db2634a828877ca966557c34f7ba_5c4a365812.webp"
                  />
                </p>
              </div>
            </el-form-item>
          </section>
        </div>
        <section>
          <h2>{{ $t('parents_info_header') }}</h2>
          <section class="flex flex-row gap-4 section-parent">
            <el-form-item :label="$t('father_info')" prop="fatherInfo">
              <el-input v-model="form.fatherInfo" placeholder="" />
            </el-form-item>
            <el-form-item :label="$t('mother_info')" prop="motherInfo">
              <el-input v-model="form.motherInfo" placeholder="" />
            </el-form-item>
          </section>
          <section>
            <el-form-item :label="$t('work_experience')" prop="workExperience">
              <el-input v-model="form.workExperience" :placeholder="$t('work_experience')" />
            </el-form-item>
          </section>
        </section>
      </div>

      <!-- Step 2 -->
      <div v-show="activeStep === 1">
        <div class="grid grid-cols-3 gap-4 section-parent">
          <section>
            <el-form-item :label="$t('last_education')" prop="lastEducation">
              <el-select v-model="form.lastEducation" :placeholder="$t('education_type')">
                <el-option :label="$t('higher')" value="higher" />
                <el-option :label="$t('secondary_special')" value="secondary_special" />
                <el-option :label="$t('general_secondary')" value="general_secondary" />
                <el-option :label="$t('primary')" value="primary" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('graduated_institution')" prop="graduatedInstitution">
              <el-input
                v-model="form.graduatedInstitution"
                :placeholder="$t('graduated_institution')"
              />
            </el-form-item>
            <el-form-item :label="$t('graduation_year')" prop="graduationYear">
              <el-date-picker
                v-model="form.graduationYear"
                type="year"
                :placeholder="$t('select_year')"
                format="YYYY"
                value-format="YYYY"
              />
            </el-form-item>
            <el-form-item :label="$t('certificate')" prop="certificateSeries">
              <el-row :gutter="10" class="!w-full">
                <el-col :span="6">
                  <el-form-item :label="$t('certificate_series')">
                    <el-input
                      v-model="form.certificateSeries"
                      :placeholder="$t('certificate_series')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$t('certificate_number')">
                    <el-input
                      v-model="form.certificateNumber"
                      :placeholder="$t('certificate_number')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('certificate_date')">
                    <el-date-picker
                      v-model="form.certificateDate"
                      type="date"
                      :placeholder="$t('select_date')"
                      value-format="YYYY-MM-DD"
                      format="DD-MM-YYYY"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="$t('language_certificate')" prop="languageCertificate">
              <el-radio-group v-model="form.languageCertificate">
                <el-radio :label="true">{{ $t('valid') }}</el-radio>
                <el-radio :label="false">{{ $t('invalid') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </section>
          <section>
            <el-form-item
              v-if="form.languageCertificate === true"
              :label="$t('certificate_type')"
              prop="certificateType"
            >
              <el-input
                v-model="form.certificateType"
                :placeholder="$t('certificate_type_placeholder')"
              />
            </el-form-item>
            <el-form-item
              v-if="form.languageCertificate === true"
              :label="$t('language_certificate')"
              prop="langCertSeries"
            >
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item :label="$t('certificate_series')">
                    <el-input
                      v-model="form.langCertSeries"
                      :placeholder="$t('certificate_series')"
                      required
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$t('certificate_number')">
                    <el-input
                      v-model="form.langCertNumber"
                      :placeholder="$t('certificate_number')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('certificate_date')">
                    <el-date-picker
                      v-model="form.langCertDate"
                      type="date"
                      :placeholder="$t('select_date')"
                      value-format="YYYY-MM-DD"
                      format="DD-MM-YYYY"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="$t('place_of_residence')" prop="placeOfResidence">
              <el-input
                v-model="form.placeOfResidence"
                :placeholder="$t('place_of_residence_placeholder')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('pdf_certificate')"
              prop="pdfCertificate"
              v-if="form.languageCertificate === true"
            >
              <div class="custom-upload-container">
                <div v-if="!certificatePdfUrl" class="upload-area">
                  <input
                    type="file"
                    ref="certificateFileInput"
                    @change="handleCertificateFileSelect"
                    accept=".pdf"
                    class="hidden-input"
                  />
                  <div class="upload-content" @click="$refs.certificateFileInput.click()">
                    <el-icon class="upload-icon"><Upload /></el-icon>
                    <div class="upload-text">{{ $t('select_pdf_file') }}</div>
                    <div class="upload-hint text-gray-500 text-sm">
                      {{ $t('certificate_file_warning') }}
                      <a
                        href="https://smallpdf.com/ru/jpg-to-pdf"
                        target="_blank"
                        class="text-red-700 underline hover:text-red-900"
                      >
                        smallpdf.com/jpg-to-pdf
                      </a>
                    </div>
                  </div>
                </div>
                <div v-else class="file-info">
                  <div class="file-details">
                    <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="file-name">{{
                      form.certificateFile?.originalName || 'certificate.pdf'
                    }}</span>
                  </div>
                  <div class="file-actions">
                    <a :href="certificatePdfUrl" class="view-btn" target="_blank">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path
                          fill-rule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </a>
                    <button @click="removeCertificateFile" class="remove-btn">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </el-form-item>
          </section>
          <section>
            <h2>{{ $t('residence_permit_header') }}</h2>
            <el-form-item :label="$t('residence_permit_series')" prop="residencePermitSeries">
              <el-input
                v-model="form.residencePermitSeries"
                :placeholder="$t('residence_permit_series')"
              />
            </el-form-item>
            <el-form-item :label="$t('residence_permit_number')" prop="residencePermitNumber">
              <el-input
                v-model="form.residencePermitNumber"
                :placeholder="$t('residence_permit_number')"
              />
            </el-form-item>
            <el-form-item :label="$t('residence_permit_issued_by')" prop="residencePermitIssuedBy">
              <el-input
                v-model="form.residencePermitIssuedBy"
                :placeholder="$t('residence_permit_issued_by')"
              />
            </el-form-item>
            <el-form-item :label="$t('residence_permit_date')" prop="residencePermitDate">
              <el-date-picker
                v-model="form.residencePermitDate"
                type="date"
                :placeholder="$t('residence_permit_date')"
                format="YYYY-MM-DD"
              />
            </el-form-item>
          </section>
        </div>
      </div>

      <!-- Step 3 -->
      <div v-show="activeStep === 2">
        <section class="grid grid-cols-3 gap-4 section-parent">
          <div>
            <el-form-item :label="$t('degree')" prop="degree">
              <el-select
                v-model="form.degree"
                :placeholder="$t('select_degree')"
                @change="getDirections"
              >
                <el-option :label="$t('bachelor')" :value="1" />
                <el-option :label="$t('master')" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('speciality')" prop="selectedDirection">
              <el-select
                v-model="form.selectedDirection"
                :placeholder="$t('speciality')"
                :disabled="!form.degree"
              >
                <el-option
                  v-for="item in directionList"
                  :key="item.id"
                  :label="item.facultyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('learnt_foreign_languages')" prop="foreignLanguage">
              <el-input
                v-model="form.foreignLanguage"
                :placeholder="$t('learnt_foreign_languages')"
              />
            </el-form-item>
            <el-form-item :label="$t('hostel')" prop="hostel">
              <el-radio-group v-model="form.hostel">
                <el-radio :label="true">{{ $t('yes') }}</el-radio>
                <el-radio :label="false">{{ $t('no_need') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item :label="$t('form.telephoneLabel')" prop="telephone">
              <el-input v-model="form.telephone" :placeholder="$t('form.optional')" />
            </el-form-item>
            <el-form-item :label="$t('form.mobileLabel')" prop="mobile">
              <el-input v-model="form.mobile" :placeholder="$t('form.enterMobile')" />
            </el-form-item>
            <el-form-item :label="$t('form.housePhoneLabel')" prop="housePhone">
              <el-input v-model="form.housePhone" :placeholder="$t('form.optional')" />
            </el-form-item>
            <el-form-item :label="$t('form.emailLabel')" prop="email">
              <el-input v-model="form.email" :placeholder="$t('form.enterEmail')" />
            </el-form-item>
          </div>
          <div>
            <el-form-item :label="$t('form.fileLabel')" prop="additionalFile">
              <div class="custom-upload-container">
                <div v-if="!additionalPdfUrl" class="upload-area">
                  <input
                    type="file"
                    ref="additionalFileInput"
                    @change="handleAdditionalFileSelect"
                    accept=".pdf"
                    class="hidden-input"
                  />
                  <div class="upload-content" @click="$refs.additionalFileInput.click()">
                    <el-icon class="upload-icon"><Upload /></el-icon>
                    <div class="upload-text">{{ $t('form.selectPdf') }}</div>
                    <div class="upload-hint text-gray-500 text-sm">
                      {{ $t('form.uploadHint') }}
                    </div>
                  </div>
                </div>
                <div v-else class="file-info">
                  <div class="file-details">
                    <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="file-name">{{
                      form.additionalFile?.originalName || 'additional_file.pdf'
                    }}</span>
                  </div>
                  <div class="file-actions">
                    <a :href="additionalPdfUrl" class="view-btn" target="_blank">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path
                          fill-rule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </a>
                    <button @click="removeAdditionalFile" class="remove-btn">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="agreements" :rules="rules.agreements">
              <el-checkbox-group v-model="form.agreements">
                <el-checkbox :label="true">
                  <span>
                    {{ locale != 'uz' ? $t('form.agreement594_html') : '' }}

                    <a href="https://lex.uz/docs/-1380636" target="_blank" style="color: #409eff">
                      {{ $t('form.agreementLinkText') }}
                    </a>
                    {{ locale == 'uz' ? $t('form.agreement594_html') : '' }}
                  </span>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </section>
      </div>
    </el-form>
    <div class="navigation-buttons">
      <el-button v-if="activeStep > 0" @click="prevStep">{{ $t('back') }}</el-button>
      <el-button v-if="activeStep < 2" type="primary" @click="validateStep(activeStep)">{{
        $t('next')
      }}</el-button>
      <el-button v-if="activeStep === 2" type="primary" @click="submitForm">{{
        $t('submit')
      }}</el-button>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { CircleCheck, Document, Edit, Upload } from '@element-plus/icons-vue'
import { useOverallStore } from '@/stores/overall'
import { vMaska } from 'maska/vue'
import { ElMessage } from 'element-plus'
import api, { BASE_URL } from '@/services/api'
import { NECESSARY_DATA } from '@/constants/necessaryData.js'
import { useRouter } from 'vue-router'

// Placeholder translation function
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import BackButton from '@/components/BackButton.vue'

const locale = localStorage.getItem('locale') || 'en'

const { t } = useI18n()
const router = useRouter()

const overallStore = useOverallStore()
const activeStep = ref(0)
const formRef = ref(null)
const photoList = ref([])
const pdfList = ref([])
const additionalFileList = ref([])
const photoPreviewUrl = ref(null)
const directionList = ref([])
const editId = ref(null)
const certificatePdfUrl = ref(null)
const additionalPdfUrl = ref(null)
const certificateFileInput = ref(null)
const additionalFileInput = ref(null)

const countries = NECESSARY_DATA.countries
const nationalities = NECESSARY_DATA.nationalities

const form = reactive({
  // Step 1
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: null,
  passport: '',
  gender: '',
  issuedBy: '',
  issuedDate: null,
  birthPlace: '',
  nationality: '',
  citizenship: '',
  disability: '',
  photo: null,
  fatherInfo: '',
  motherInfo: '',
  workExperience: '',

  // Step 2
  lastEducation: '',
  graduatedInstitution: '',
  graduationYear: '',
  certificateSeries: '',
  certificateNumber: '',
  certificateDate: null,
  languageCertificate: true,
  certificateType: '',
  langCertSeries: '',
  langCertNumber: '',
  langCertDate: null,
  placeOfResidence: '',
  pdfCertificate: null,
  residencePermitSeries: '',
  residencePermitNumber: '',
  residencePermitIssuedBy: '',
  residencePermitDate: null,
  certificateFile: null,
  status: '',
  rejectionReason: '',

  // Step 3
  degree: '',
  selectedDirection: '',
  foreignLanguage: '',
  hostel: true,
  telephone: '',
  mobile: '',
  housePhone: '',
  email: '',
  additionalFile: null,
  agreements: [],
})

const rules = {
  // Step 1
  firstName: [{ required: true, message: t('form.errors.firstNameRequired'), trigger: 'blur' }],
  lastName: [{ required: true, message: t('form.errors.lastNameRequired'), trigger: 'blur' }],
  middleName: [{ required: true, message: t('form.errors.middleNameRequired'), trigger: 'blur' }],
  birthDate: [{ required: true, message: t('form.errors.birthDateRequired'), trigger: 'change' }],
  passport: [
    { required: true, message: t('form.errors.passportRequired'), trigger: 'blur' },
  ],
  gender: [{ required: true, message: t('form.errors.genderRequired'), trigger: 'change' }],
  issuedBy: [{ required: true, message: t('form.errors.issuedByRequired'), trigger: 'blur' }],
  issuedDate: [{ required: true, message: t('form.errors.issuedDateRequired'), trigger: 'change' }],
  birthPlace: [{ required: true, message: t('form.errors.birthPlaceRequired'), trigger: 'blur' }],
  nationality: [
    { required: true, message: t('form.errors.nationalityRequired'), trigger: 'change' },
  ],
  citizenship: [
    { required: true, message: t('form.errors.citizenshipRequired'), trigger: 'change' },
  ],
  disability: [{ required: true, message: t('form.errors.disabilityRequired'), trigger: 'change' }],
  photo: [{ required: true, message: t('form.errors.photoRequired'), trigger: 'change' }],
  fatherInfo: [{ required: true, message: t('form.errors.fatherInfoRequired'), trigger: 'blur' }],
  motherInfo: [{ required: true, message: t('form.errors.motherInfoRequired'), trigger: 'blur' }],
  workExperience: [
    { required: true, message: t('form.errors.workExperienceRequired'), trigger: 'blur' },
  ],

  // Step 2
  lastEducation: [
    { required: true, message: t('form.errors.lastEducationRequired'), trigger: 'change' },
  ],
  graduatedInstitution: [
    { required: true, message: t('form.errors.graduatedInstitutionRequired'), trigger: 'blur' },
  ],
  graduationYear: [
    { required: true, message: t('form.errors.graduationYearRequired'), trigger: 'change' },
  ],
  certificateSeries: [
    { required: true, message: t('form.errors.certificateSeriesRequired'), trigger: 'blur' },
  ],
  languageCertificate: [
    { required: true, message: t('form.errors.languageCertificateRequired'), trigger: 'change' },
  ],
  // placeOfResidence: [{ required: true, message: t('form.errors.placeOfResidenceRequired'), trigger: 'blur' }],
  // residencePermitSeries: [{ required: true, message: t('form.errors.residencePermitSeriesRequired'), trigger: 'blur' }],
  // residencePermitNumber: [{ required: true, message: t('form.errors.residencePermitNumberRequired'), trigger: 'blur' }],
  // residencePermitIssuedBy: [{ required: true, message: t('form.errors.residencePermitIssuedByRequired'), trigger: 'blur' }],
  // residencePermitDate: [{ required: true, message: t('form.errors.residencePermitDateRequired'), trigger: 'change' }],

  // Step 3
  degree: [{ required: true, message: t('form.errors.degreeRequired'), trigger: 'change' }],
  selectedDirection: [
    { required: true, message: t('form.errors.selectedDirectionRequired'), trigger: 'change' },
  ],
  foreignLanguage: [
    { required: true, message: t('form.errors.foreignLanguageRequired'), trigger: 'blur' },
  ],
  hostel: [{ required: true, message: t('form.errors.hostelRequired'), trigger: 'change' }],
  mobile: [
    { required: true, message: t('form.errors.mobileRequired'), trigger: 'blur' },
    { pattern: /^\+\d{10,12}$/, message: t('form.errors.mobileFormat'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('form.errors.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('form.errors.emailFormat'), trigger: 'blur' },
  ],
  additionalFile: [
    { required: true, message: t('form.errors.additionalFileRequired'), trigger: 'change' },
  ],
  agreements: [
    {
      validator: (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error(t('form.errors.agreementsRequired')))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

// Computed rules for conditional validation
const computedRules = computed(() => {
  return { ...rules }
})

const getDirections = async () => {
  const response = await api.get(`/faculty?levelId=${form.degree}`)
  directionList.value = response.data.data
}

const validateStep = (step) => {
  if (step < 2) {
    activeStep.value++
  }
  // formRef.value?.validate((valid) => {
  //     if (valid) {

  //     } else {
  //         ElMessage.error(t('form.errors.fillRequiredFields'))
  //     }
  // })
}

const handlePhotoChange = async (file, list) => {
  photoList.value = [file]
  const formData = new FormData()
  formData.append('file', file.raw)
  try {
    const response = await api.post('/attachment/PHOTO', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('response', response)
    form.photo = response.data.data
    photoPreviewUrl.value = BASE_URL + '/storage/files/' + response.data.data.pathFile
    console.log('photoPreviewUrl', photoPreviewUrl.value)
  } catch (error) {
    ElMessage.error(t('form.errors.photoUploadFailed')) // e.g. "Photo upload failed"
  }
}

const handleCertificateFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file
    if (!beforeUpload(file)) {
      event.target.value = ''
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/attachment/CERTIFICATES', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      form.certificateFile = response.data.data
      certificatePdfUrl.value = BASE_URL + '/storage/files/' + response.data.data.pathFile
    } catch (error) {
      ElMessage.error(t('form.errors.photoUploadFailed')) // e.g. "Photo upload failed"
    }
  }
}

const handleAdditionalFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file
    if (!beforeUpload(file)) {
      event.target.value = ''
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/attachment/ATTACHMENTS', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      form.additionalFile = response.data.data
      additionalPdfUrl.value = BASE_URL + '/storage/files/' + response.data.data.pathFile
    } catch (error) {
      ElMessage.error(t('form.errors.photoUploadFailed')) // e.g. "Photo upload failed"
    }
  }
}

const beforePhotoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
  const isUnder2MB = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error(t('form.errors.photoImageOnly')) // e.g. "Only JPG images are allowed"
    return false
  }

  if (!isUnder2MB) {
    ElMessage.error(t('form.errors.photoSizeLimit')) // e.g. "Image must be smaller than 2MB"
    return false
  }

  return true
}

const beforeUpload = (file) => {
  const isPDF = file.type === 'application/pdf'
  const isSizeValid = file.size / 1024 / 1024 < 5

  if (!isPDF) {
    ElMessage.error(t('form.errors.pdfOnly'))
    return false
  }

  if (!isSizeValid) {
    ElMessage.error(t('form.errors.pdfSizeLimit'))
    return false
  }

  return true
}

const handleExceed = () => {
  ElMessage.warning(t('form.warnings.singleFileOnly'))
}

const openPdfFile = (url, fileName) => {
  try {
    window.open(url, '_blank')

    // link.download = fileName || 'document.pdf';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  } catch (error) {
    ElMessage.error(t('form.errors.pdfOpenFailed') || 'Failed to open PDF file')
  }
}

const handleUpload = async (param) => {
  try {
    // const formData = new FormData()
    // formData.append('file', param.file)
    // await your API call
    ElMessage.success(t('form.messages.uploadSuccess'))
  } catch (error) {
    ElMessage.error(t('form.messages.uploadFailed'))
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const createRequestBody = () => {
  return {
    id: editId.value || null,
    family: form.lastName,
    name: form.firstName,
    surname: form.middleName,
    birthDate: form.birthDate,
    passportSeriaAndNumber: form.passport,
    issuedBy: form.issuedBy,
    issuedDate: form.issuedDate,
    placeOfBirth: form.birthPlace,
    nationality: form.nationality,
    citizenship: form.citizenship,
    disability: form.disability,
    gender: form.gender,
    workPerformedAndExperience: form.workExperience,
    address: form.placeOfResidence,
    photoId: form.photo.id || null,
    fatherInfo: form.fatherInfo,
    matherInfo: form.motherInfo,
    residencePermitSeries: form.residencePermitSeries,
    residencePermitNumber: form.residencePermitNumber,
    residencePermitIssuedBy: form.residencePermitIssuedBy,
    residencePermitExpiryDate: form.residencePermitDate,
    educationType: form.lastEducation,
    applicationType: 'EXTERNAL_STUDENT',
    graduateInstitute: form.graduatedInstitution,
    graduatedDate:
      form.graduationYear && form.graduationYear.length < 5
        ? `${form.graduationYear}-01-01`
        : form.graduationYear.length >= 5
          ? form.graduationYear
          : null,
    certificateSeries: form.certificateSeries,
    certificateNumber: form.certificateNumber,
    certificateDate: form.certificateDate ? form.certificateDate : null,
    certificateId: form.certificateFile.id || null,
    certificateLanguage: form.languageCertificate === true || form.languageCertificate === true,
    certificateLanguageSeries: form.langCertSeries,
    certificateLanguageNumber: form.langCertNumber,
    certificateLanguageDate: form.langCertDate ? form.langCertDate : null,
    certificateLanguageType: form.certificateType,
    educationLevelId: Number(form.degree),
    facultyId: Number(form.selectedDirection),
    languages: form.foreignLanguage,
    needDormitory: form.hostel === 'true' || form.hostel === true,
    phoneNumber: form.telephone,
    mobileNumber: form.mobile,
    homePhoneNumber: form.housePhone,
    email: form.email,
    attachmentId: form.additionalFile.id || null,
  }
}

const submitForm = async () => {
  // Define which fields belong to which step
  const stepFields = {
    0: [
      'firstName',
      'lastName',
      'middleName',
      'birthDate',
      'passport',
      'gender',
      'issuedBy',
      'issuedDate',
      'birthPlace',
      'nationality',
      'citizenship',
      'disability',
      'photo',
      'fatherInfo',
      'motherInfo',
      'workExperience',
    ],
    1: [
      'lastEducation',
      'graduatedInstitution',
      'graduationYear',
      'certificateSeries',
      'languageCertificate',
      'certificateFile',
      'certificateType',
      'langCertSeries',
    ],
    2: [
      'degree',
      'selectedDirection',
      'foreignLanguage',
      'hostel',
      'mobile',
      'email',
      'additionalFile',
      'agreements',
    ],
  }

  // Check each step for validation errors
  for (let step = 0; step <= 2; step++) {
    const fieldsToValidate = stepFields[step]

    // Create a validation promise for this step
    const validateStepFields = () => {
      return new Promise((resolve, reject) => {
        formRef.value.validateField(fieldsToValidate, (valid, fields) => {
          if (valid) {
            resolve(true)
          } else {
            reject({ step, fields })
          }
        })
      })
    }

    try {
      await validateStepFields()
    } catch (error) {
      // If validation fails, move to the step with the error
      activeStep.value = error.step
      ElMessage.error(t('form.errors.fillRequiredFields'))
      return
    }
  }

  // If all validation passes, submit the form
  try {
    const response = await (editId.value
      ? api.put('/statement', createRequestBody())
      : api.post('/statement', createRequestBody()))
    ElMessage.success(t('form.messages.submitSuccess'))

    formRef.value.resetFields()
    activeStep.value = 0
    certificatePdfUrl.value = null
    additionalPdfUrl.value = null
    await fetchUserData() // Refresh user data after submission
  } catch (error) {
    ElMessage.error(t('form.messages.submitFailed'))
  }
}

const fetchUserData = async () => {
  overallStore.startLoader()
  try {
    const response = await api.get('/statement')

    const apiData = response.data.data
    if (!apiData || !apiData.id) {
      overallStore.stopLoader()
      return
    }
    if (apiData.applicationType !== 'EXTERNAL_STUDENT') {
      router.push('/pages/law-schools-application')
    }
    editId.value = apiData.id
    form.firstName = apiData.name
    form.lastName = apiData.family
    form.middleName = apiData.surname
    form.birthDate = apiData.birthDate
    form.passport = apiData.passportSeriaAndNumber
    form.gender = apiData.gender
    form.issuedBy = apiData.issuedBy
    form.issuedDate = apiData.issuedDate
    form.birthPlace = apiData.placeOfBirth
    form.nationality = apiData.nationality
    form.citizenship = apiData.citizenship
    form.disability = apiData.disability
    form.photo = apiData.photo || null
    photoPreviewUrl.value = BASE_URL + '/storage/files/' + apiData.photo.pathFile
    form.fatherInfo = apiData.fatherInfo
    form.motherInfo = apiData.matherInfo
    form.workExperience = apiData.workPerformedAndExperience
    form.status = apiData.status
    form.rejectionReason = apiData.statusComment

    form.lastEducation = apiData.educationType
    form.graduatedInstitution = apiData.graduateInstitute
    form.graduationYear = apiData.graduatedDate
    form.certificateSeries = apiData.certificateSeries
    form.certificateNumber = apiData.certificateNumber
    form.certificateDate = apiData.certificateDate
    form.languageCertificate = apiData.certificateLanguage
    form.certificateFile = apiData.certificate || null
    if (apiData.certificate) {
      certificatePdfUrl.value = BASE_URL + '/storage/files/' + apiData.certificate.pathFile
    }
    form.langCertSeries = apiData.certificateLanguageSeries || ''
    form.certificateType = apiData.certificateLanguageType || '' // not provided in API
    form.langCertNumber = apiData.certificateLanguageNumber || ''
    form.langCertDate = apiData.certificateLanguageDate
      ? dayjs(apiData.certificateLanguageDate).format('YYYY-MM-DD')
      : null
    form.placeOfResidence = apiData.address
    form.pdfCertificate = apiData.attachment || null
    form.residencePermitSeries = apiData.residencePermitSeries
    form.residencePermitNumber = apiData.residencePermitNumber
    form.residencePermitIssuedBy = apiData.residencePermitIssuedBy
    form.residencePermitDate = apiData.residencePermitExpiryDate

    form.degree = apiData.educationLevel?.id || ''
    form.selectedDirection = apiData.faculty?.id || ''
    form.foreignLanguage = apiData.languages
    form.hostel = apiData.needDormitory
    form.telephone = apiData.phoneNumber
    form.mobile = apiData.mobileNumber
    form.housePhone = apiData.homePhoneNumber
    form.email = apiData.email
    form.additionalFile = apiData.attachment || null
    if (apiData.attachment) {
      additionalPdfUrl.value = BASE_URL + '/storage/files/' + apiData.attachment.pathFile
    }
    await getDirections()
  } catch (error) {
    // console.error("Error fetching user data:", error)
    // ElMessage.error(t('form.messages.fetchFailed'))
    overallStore.stopLoader()
  } finally {
    overallStore.stopLoader()
  }
}

const removeCertificateFile = () => {
  form.certificateFile = null
  certificatePdfUrl.value = null
  if (certificateFileInput.value) {
    certificateFileInput.value.value = ''
  }
}

const removeAdditionalFile = () => {
  form.additionalFile = null
  additionalPdfUrl.value = null
  if (additionalFileInput.value) {
    additionalFileInput.value.value = ''
  }
}

onMounted(async () => {
  await fetchUserData()
})
</script>

<style scoped>
.upload-demo {
  width: 100%;
  border: 6px dashed #dcdfe6;
  border-radius: 6px;
  padding: 10px;

  text-align: center;
}

.user-photo {
  width: 12rem;
  height: 16rem;
  object-fit: cover;
}

.application_header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  font-size: 1.5rem;
}

/* Custom Upload Styles */
.custom-upload-container {
  width: 100%;
}

.hidden-input {
  display: none;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: rgb(138, 0, 25);
  background-color: #f5f7fa;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 24px;
  color: #909399;
}

.upload-text {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

.upload-hint {
  margin-top: 8px;
  line-height: 1.4;
}

.file-info {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px;
  background-color: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn {
  padding: 6px;
  background-color: rgb(138, 0, 25);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.view-btn:hover {
  background-color: rgb(108, 0, 20);
}

.remove-btn {
  padding: 6px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.remove-btn:hover {
  background-color: #e74c3c;
}

/* Fixed Navigation Buttons */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding: 0;
}

.navigation-buttons .el-button {
  pointer-events: auto;

  border-radius: 8px;
  padding: 12px 24px;
  min-width: 120px;
}

/* Form Container with bottom padding */
.form-container {
  padding-bottom: 20px;
}

@media screen and (max-width: 900px) {
  .section-parent {
    display: flex;
    flex-direction: column;
  }

  .application_header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;
  }

  .file-info {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .file-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .form-container {
    padding-bottom: 20px;
  }
}
</style>