<template>
    <div>
      <div v-if="!isLoading">
        <div class="" v-if="navigator[navigator.length-1].screen ===  'select-product'">
          <div class="text-center mx-auto pt-4" style="max-width: 600px">
            <img alt="" class="img-fluid rounded-circle mb-3" src="/images/olivia.jpg" style="height: 50px">
            <h1 class="text-30 my-0 fw-600">Hi there, I'm Olivia</h1>
            <p>What cover would you like to get?</p>
          </div>
          <!--Products containers-->
          <div class="container mt-5">
            <b-tabs class="plain-tabs" v-if="show_tabs">
              <b-tab v-for="(product, index) in products" class="pt-4" :key="'products-'+index" :title="product.name">
                <!--Products children-->
                <div class="row justify-content-center pt-5 mx-0" v-if="Array.isArray(product.children)">
                  <div v-for="(child, i) in product.children" :key="'productsChild-'+i+index"
                       class="col-lg-4 col-xl-3 col-md-6 cursor-pointer mb-4 pl-0">
                    <div class="p-4 br-4 border rounded-xl border-solid cursor-pointer" style="height: 100%"
                         :class="selectedProd === `${index}+${i}` ? 'selected': 'not-selected'"
                         @click="selectProduct(index,i)">
                      <div class="mb-3 d-flex align-items-center justify-content-center"
                           :class="selectedProd=== `${index}+${i}` ? 'selected-circle': 'not-selected-circle'"
                           style="height: 16px; width: 16px;">
                        <div style="height: 9px; width: 9px;">
                        </div>
                      </div>
                      <div>
                        <div class="text-gray-500 fw-700 mb-2">{{ child.name }}</div>
                        <div class="text-12 text-grey-600 fw-300" v-if="!isLoading">{{
                            replaceText(child.desc, child.alternative_price ? child.alternative_price : child.price)
                          }}
                        </div>
                        <div v-else>
                          <b-skeleton width="80%" height="1rem"></b-skeleton>
                          <b-skeleton width="40%" height="1rem"></b-skeleton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!---->
              </b-tab>
            </b-tabs>
            <div v-else class="container">
              <div class="row align-items-center justify-content-center pt-5 mt-5">
                <div class="col-md-3 mb-4" v-for="i in 4" :key="i">
                  <b-skeleton width="100%" height="100px"></b-skeleton>
                </div>
              </div>
            </div>
  
            <div v-if="show_tabs" class="text-center mt-5 py-4">
              <button @click="next({screen: 'product-benefit'}, 1)" :disabled="!this.$route.query.p"
                      class="btn btn-primary btn-block col-md-5 col-lg-4 mx-auto">
                <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                Get Covered
              </button>
            </div>
          </div>
          <!---->
        </div>
  
        <!--    The product Benefits Details-->
        <div v-else-if="navigator[navigator.length-1].screen === 'product-benefit'" class="pt-4 mt-md-3 pb-5 px-4 mx-auto"
             style="min-height: 100vh">
          <div>
            <!--=======Back button-->
            <div class="d-flex justify-content-between cursor-pointer align-items-center">
              <div @click="prev" class="go-back cursor-pointer justify-content-between">
                <div>
                  <img alt="back-button" class="img-fluid" src="/images/icons/arrow-left.svg">
                </div>
                <div class="text-12 pl-2">Go Back</div>
              </div>
              <div class="ml-n5 d-none d-md-block">
                <div class="ml-n5">
                  <img src="/images/logos/mycovergenius.svg" class="img-fluid ml-n3" alt="">
                </div>
              </div>
              <div></div>
            </div>
  
            <div class="row mx-0 justify-content-center">
              <div class="col-md-7 col-xl-5">
                <!--======Introduction Message=========-->
                <div class="text-center pt-3">
                  <img alt="" class="img-fluid rounded-circle mb-4" src="/images/olivia.jpg" style="height: 50px">
                  <h1 class="text-24 fw-600" v-html="intro_message[navigator[navigator.length-1].screen].t"></h1>
  
                  <p v-if="$route.query.p === 'zencare'"
                     v-html=" `ZenCare covers you and your staff with quality healthcare at only <span class='fw-500'>₦${buy_form.price}</span>  per person.`"
                     class="fw-300 text-14 text-grey-700">
                  </p>
                  <p v-else-if="$route.query.p === 'zencareplus'"
                     v-html="`ZenCare Plus covers you and your staff with quality healthcare at only <span class='fw-500'>₦${buy_form.price}</span> per person.`"
                     class="fw-300 text-14 text-grey-700">
                    {
                  </p>
                  <p v-else class="fw-300 text-14 text-grey-700">
                    {{
                      replaceText(benefits[$route.query.p].desc, products[selectedProd[0]].children[selectedProd[2]].alternative_price ? products[selectedProd[0]].children[selectedProd[2]].alternative_price : products[selectedProd[0]].children[selectedProd[2]].price)
                    }}
                  </p>
  
                </div>
                <!--=========-->
  
                <div class="desc py-3 mt-md-4 px-3 px-md-4 text-lg-18 mx-auto rounded"
                     v-if="benefits[this.$route.query.p].notice">
                  <!--Unlock Price Button-->
                  <extra :text="benefits[this.$route.query.p].notice.text"
                         :price="products[selectedProd[0]].children[selectedProd[2]].alternative_price ?  products[selectedProd[0]].children[selectedProd[2]].alternative_price : products[selectedProd[0]].children[selectedProd[2]].price"
                         @onChange="watchUnlockingPrice"
                         :active="benefits[this.$route.query.p].notice.active">
                    <template #icon>
                      <svg id="tooltip" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.66667 0C2.99333 0 0 2.99333 0 6.66667C0 10.34 2.99333 13.3333 6.66667 13.3333C10.34 13.3333 13.3333 10.34 13.3333 6.66667C13.3333 2.99333 10.34 0 6.66667 0ZM6.16667 4C6.16667 3.72667 6.39333 3.5 6.66667 3.5C6.94 3.5 7.16667 3.72667 7.16667 4V7.33333C7.16667 7.60667 6.94 7.83333 6.66667 7.83333C6.39333 7.83333 6.16667 7.60667 6.16667 7.33333V4ZM7.28 9.58667C7.24667 9.67333 7.2 9.74 7.14 9.80667C7.07333 9.86667 7 9.91333 6.92 9.94667C6.84 9.98 6.75333 10 6.66667 10C6.58 10 6.49333 9.98 6.41333 9.94667C6.33333 9.91333 6.26 9.86667 6.19333 9.80667C6.13333 9.74 6.08667 9.67333 6.05333 9.58667C6.02 9.50667 6 9.42 6 9.33333C6 9.24667 6.02 9.16 6.05333 9.08C6.08667 9 6.13333 8.92667 6.19333 8.86C6.26 8.8 6.33333 8.75333 6.41333 8.72C6.57333 8.65333 6.76 8.65333 6.92 8.72C7 8.75333 7.07333 8.8 7.14 8.86C7.2 8.92667 7.24667 9 7.28 9.08C7.31333 9.16 7.33333 9.24667 7.33333 9.33333C7.33333 9.42 7.31333 9.50667 7.28 9.58667Z"
                          fill="#039855"/>
                      </svg>
                    </template>
                  </extra>
                  <modal success-text="Yes, I understand" :active="promptUnlockingPrice" @proceed="watchUnlockingPrice"
                         @exit="unwatchUnlockingPrice"
                         :desc="notifyWatch"/>
                  <b-tooltip target="tooltip" variant="white" triggers="focus" :offset="-5">
                    <span v-html="benefits[this.$route.query.p].notice.more" class="font-weight-medium text-12"></span>
                  </b-tooltip>
                </div>
  
                <!--=======Product Description-->
                <div class="mw-551 mx-auto">
                  <div class="product-benefits p-4 py-md-4 px-md-5 mt-4">
                    <p class="fw-400" style="color: #000000">Your business gets:</p>
                    <div>
                      <div v-for="(benefit, i) in benefits[$route.query.p].benefits" :key="'benefit-'+i"
                           class="d-flex mb-2 align-items-start">
                        <div>
                          <div style="width: 30px">
                            <img src="/images/icons/check-circle-small.svg" class="img-fluid" alt="">
                          </div>
                        </div>
                        <div style="color: #475467" class="text-gray-600 fw-400 text-xs-14 text-md-14 text-lg-14"
                             v-html="benefit"></div>
                      </div>
                    </div>
  
                    <div>
                      <div class="fw-600 cursor-pointer text-green text-14 py-2 pr-2" @click="show = true">
                        {{
                          benefits[$route.query.p].moreBtnLabel ? benefits[$route.query.p].moreBtnLabel : 'learn more...'
                        }}
                      </div>
                      <benefit-table @close="close"
                                     :desc="replaceText(benefits[$route.query.p].more.desc, selected.price)"
                                     v-if="show && !benefits[$route.query.p].tab && benefits[$route.query.p].health"
                                     :data="benefits[$route.query.p].more.data"
                                     :labels="benefits[$route.query.p].more.labels"/>
  
                      <zen-tab @tab="trackTab" @close="close"
                               :more-desc="replaceText(benefits[$route.query.p].more.desc, selected.price)"
                               v-else-if="show && benefits[zenTabSelected].tab && benefits[$route.query.p].health"
                               :tab-content="benefits[zenTabSelected]"/>
  
                      <learn-more @close="close" :desc="replaceText(benefits[$route.query.p].more.desc, selected.price)"
                                  v-else-if="!benefits[$route.query.p].health && !benefits[$route.query.p].tab && show"
                                  :more="benefits[$route.query.p].more.data"
                                  :labels="benefits[$route.query.p].more.labels"/>
                    </div>
                  </div>
                </div>
  
                <!--Proceed Button-->
                <div class="text-center">
                  <button :disabled="showSpinner" class="mt-4 mt-md-5 w-100 btn mx-auto btn-primary" type="button"
                          @click="next({screen: 'buy-one'})">
                    <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                    Click to Start
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--===-->
  
        <!--Verification Sections-->
        <div v-else-if="navigator.length > 2" class="d-flex" style="min-height: 100vh">
  
          <!--Steps-->
          <div class="d-none d-md-block bg-side text-white" style="width: 520px">
            <div class="container">
              <div style="height: 200px"></div>
  
              <div class="px-4">
                <div v-for="(item, index) in steps" class="text-white d-flex">
                  <div style="width: 40px;">
                    <!--===========Images======-->
                    <div>
                      <div>
                        <img v-if="(index === 0 && isOTPVerified) || (index === 1 && paid) || (index === 2 && paid)"
                             src="/images/icons/check-mark.svg" class="img-fluid" alt="verified checkmark">
                        <div
                          v-else-if="(index === 0 && !isOTPVerified) || (index === 1 && !verifyDetails) || (index === 2 && !paid)">
                          <img src="/images/icons/circle.svg" class="img-fluid" alt="notVerified circle">
                        </div>
                      </div>
                    </div>
                    <!--======-->
  
                    <!--Border Lines-->
                    <div v-if="index < steps.length-1">
                      <div>
                        <div v-if="index === 0 && isOTPVerified" class="ml-3"
                             style="border-left: 2px solid #F8FCFB; height: 50px;"></div>
                        <div v-if=" index === 1 && paid" class="ml-3"
                             style="border-left: 2px solid #F8FCFB; height: 50px;"></div>
                        <div v-if="index === 2 && paid" class="ml-3"
                             style="border-left: 2px solid #F8FCFB; height: 50px;"></div>
                        <div v-else-if="index === 0 && !isOTPVerified">
                          <div class="ml-3" style="border-left: 2px dashed #9CD3C9; height: 50px;"></div>
                        </div>
                        <div v-else-if="index === 1 && !paid">
                          <div class="ml-3" style="border-left: 2px dashed #9CD3C9; height: 50px;"></div>
                        </div>
                      </div>
                    </div>
                    <!--========-->
                  </div>
  
                  <div class="pb-4 pl-2 pt-1">
                    {{ item.title ? item.title : 'title' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--======-->
  
          <div class="w-100">
            <div class="container">
              <!--=========Section Header-->
              <div>
                <!--==========Back button-->
                <div style="height: 60px">
                  <div class="d-flex pb-5 justify-content-between cursor-pointer mt-2 ml-md-5 pt-5 align-items-center">
                    <div @click="prev" class="go-back justify-content-between">
                      <div>
                        <img alt="" class="img-fluid" src="/images/icons/arrow-left.svg">
                      </div>
                      <div class="text-12 pl-2">Go Back</div>
                    </div>
  
                    <div class="ml-n5 d-none d-md-block">
                      <div class="ml-n5">
                        <img src="/images/logos/mycovergenius.svg" class="img-fluid ml-n4" alt="">
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <!--==========-->
  
                <div class="py-3"/>
                <!--=========Section Header-->
                <div class="text-center pt-4">
  
                  <!--========Avatar-->
                  <div class="rounded-circle mb-4">
                    <img alt="avatar" class="img-fluid rounded-circle" src="/images/olivia.jpg" style="height:50px">
                  </div>
                  <!--==========-->
  
                  <h1 class="text-24 mw-551 mx-auto fw-600"
                      v-html="intro_message[navigator[navigator.length-1].screen].t"/>
                  <p class="mw-551 text-grey-700 fw-300 mx-auto"
                     v-html="intro_message[navigator[navigator.length-1].screen].d"/>
                </div>
                <!--=========-->
              </div>
              <!--==========-->
  
              <div class="mx-auto pt-4 pb-5 mb-5">
  
                <!--=====Forms-->
                <div v-if="navigator[navigator.length-1].screen.includes('buy-')">
                  <div class="mw-400 mx-auto" v-show="navigator[navigator.length-1].screen ===  'buy-one'">
                    <validation-observer ref="form" v-slot="{ handleSubmit }">
                      <b-form :novalidate="true"
                              @submit.stop.prevent="handleSubmit($refs.form.flags.passed? next({screen: 'buy-two'}): false)">
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="First Name"
                        >
                          <b-form-group label="First Name">
                            <b-form-input
                              id="first-name"
                              v-model="form.first_name"
                              :state="getValidationState(validationContext)"
                              aria-describedby="full-name-live-feedback"
                              name="first-name" placeholder="Enter your first name" required></b-form-input>
                            <b-form-invalid-feedback id="first-name-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
  
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="Last Name"
                        >
                          <b-form-group label="Last Name">
                            <b-form-input
                              id="last-name"
                              v-model="form.last_name"
                              :state="getValidationState(validationContext)"
                              aria-describedby="last-name-live-feedback"
                              name="last-name" placeholder="Enter your last name" required></b-form-input>
                            <b-form-invalid-feedback id="last-name-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                        <div class="text-center">
                          <button :disabled="showSpinner" class="mt-5 w-100 btn mx-auto btn-primary font-weight-bold"
                                  type="submit">
                            <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                            Continue
                          </button>
                        </div>
                      </b-form>
                    </validation-observer>
                  </div>
  
                  <div class="mw-400 mx-auto" v-show="navigator[navigator.length-1].screen ===  'buy-two'">
                    <validation-observer ref="form1" v-slot="{ handleSubmit }">
                      <b-form :novalidate="true"
                              @submit.prevent="handleSubmit( $refs.form1.flags.passed? next({screen: 'buy-three'}): false)">
  
                        <validation-provider v-slot="validationContext" :rules="{ required: true }" name="Business Name">
                          <b-form-group label="Business Name">
                            <b-form-input
                              id="business-name"
                              v-model="form.business_name"
                              :state="getValidationState(validationContext)"
                              aria-describedby="business-name-live-feedback"
                              name="business-name" placeholder="Enter your business name" required></b-form-input>
                            <b-form-invalid-feedback id="business-name-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
  
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="Business Sector"
                        >
                          <b-form-group label="Business Sector">
                            <b-form-select
                              id="sector"
                              v-model="form.business_sector"
                              :options="sectors"
                              :state="getValidationState(validationContext)"
                              aria-describedby="sector-live-feedback"
                              name="sector"
                              required></b-form-select>
                            <b-form-invalid-feedback id="sector-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                        <div class="text-center">
                          <button :disabled="showSpinner" class="mt-5 w-100 btn mx-auto btn-primary font-weight-bold"
                                  type="submit">
                            <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                            Continue
                          </button>
                        </div>
                      </b-form>
                    </validation-observer>
                  </div>
  
                  <div class="mw-400 mx-auto" v-show="navigator[navigator.length-1].screen ===  'buy-three'">
                    <validation-observer ref="form2" v-slot="{ handleSubmit }">
                      <b-form :novalidate="true"
                              @submit.prevent="handleSubmit($refs.form2.flags.passed? next({screen: 'buy-four'}):false)">
  
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="Business Email"
                        >
                          <b-form-group label="Business Email">
                            <b-form-input
                              id="email"
                              v-model="form.business_email"
                              :state="getValidationState(validationContext)"
                              aria-describedby="email-live-feedback" name="email"
                              placeholder="Enter your email" required type="email"></b-form-input>
                            <b-form-invalid-feedback id="email-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
  
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="Phone Number"
                        >
                          <b-form-group label="Business Phone Number">
                            <b-form-input
                              id="phone"
                              v-model="form.business_phone_number"
                              :state="getValidationState(validationContext)"
                              aria-describedby="phone-live-feedback" type="number"
                              name="phone" placeholder="Enter your business phone number"
                              required></b-form-input>
                            <b-form-invalid-feedback id="phone-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                        <div class="text-center">
                          <button :disabled="showSpinner" class="mt-5 w-100 btn mx-auto btn-primary font-weight-bold"
                                  type="submit">
                            <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                            Continue
                          </button>
                        </div>
                      </b-form>
                    </validation-observer>
                  </div>
  
                  <div class="mw-400 mx-auto" v-show="navigator[navigator.length-1].screen ===  'buy-four'">
                    <validation-observer ref="form3" v-slot="{ handleSubmit }">
                      <b-form :novalidate="true"
                              @submit.prevent="handleSubmit($refs.form3.flags.passed? next({screen: 'buy-five'}):false)">
  
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="State"
                        >
                          <b-form-group label="State">
                            <b-form-select
                              id="state"
                              v-model="form.business_state_of_residence"
                              :options="states"
                              :state="getValidationState(validationContext)"
                              aria-describedby="state-live-feedback"
                              name="state"
                              required></b-form-select>
                            <b-form-invalid-feedback id="state-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
  
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="City"
                        >
                          <b-form-group label="City">
                            <b-form-select
                              id="city"
                              v-model="form.business_city_of_residence"
                              :options="cities"
                              :state="getValidationState(validationContext)"
                              aria-describedby="city-live-feedback"
                              name="city"
                              required></b-form-select>
                            <b-form-invalid-feedback id="city-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
  
                        <validation-provider
                          v-slot="validationContext"
                          :rules="{ required: true }"
                          name="Business Address"
                        >
                          <b-form-group label="Business Address">
                            <b-form-input
                              id="business-address"
                              v-model="form.business_address"
                              :state="getValidationState(validationContext)"
                              aria-describedby="business-name-live-feedback"
                              name="business-address" placeholder="Enter your business address"
                              required></b-form-input>
                            <b-form-invalid-feedback id="business-address-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                        <div class="text-center">
                          <button :disabled="showSpinner" class="mt-5 w-100 btn mx-auto btn-primary font-weight-bold"
                                  type="submit">
                            <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                            Continue
                          </button>
                        </div>
                      </b-form>
                    </validation-observer>
                  </div>
  
                  <div class="mw-551 mx-auto" v-show="navigator[navigator.length-1].screen ===  'buy-five'">
                    <validation-observer ref="form4" v-slot="{ handleSubmit }">
                      <b-form :novalidate="true"
                              @submit.prevent="handleSubmit($refs.form4.flags.passed ? registerBusiness : false)">
                        <validation-provider v-slot="validationContext" :rules="{ min: 8 }" name="Password">
                          <b-form-group class="mw-400 mx-auto" description="At least 8 characters." label="Password">
                            <b-input-group class="formal-input bg-white d-flex align-items-center br-8 pr-2"
                                           style="border: 1px solid #D6DDE0;">
                              <b-form-input id="password" autocomplete="new-password"
                                            v-model="form.password" minlength="8"
                                            :state="getValidationState(validationContext)"
                                            :type="isPassword ? 'password' : 'text'"
                                            aria-describedby="password-live-feedback"
                                            class="bg-transparent border-0 mr-2"
                                            name="password" placeholder="Create a password" required></b-form-input>
                              <b-input-group-append>
                                <div class="cursor-pointer" @click="togglePassword">
                                  <img alt="" v-show="isPassword" class="img-fluid" src="/images/icons/eye.svg">
                                  <img alt="" v-show="!isPassword" class="img-fluid opacity-5" style="width: 20px"
                                       src="/images/icons/eye-closed.svg">
                                </div>
                              </b-input-group-append>
                            </b-input-group>
                            <b-form-invalid-feedback id="password-live-feedback">{{
                                validationContext.errors[0]
                              }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                        <div class="d-flex align-items-center flex-wrap justify-content-center pt-4 pb-3 mw-450 mx-auto">
                          <div v-for="(item) in passwordValidation" class="d-flex mr-3 mb-2 align-items-center">
                            <div class="mr-1">
                              <img style="width: 20px" v-show="!item.status"
                                   src="/images/icons/small-check-circle-grey.svg" class="img-fluid"
                                   alt="">
                              <img style="width: 20px" v-show="item.status"
                                   src="/images/icons/small-check-circle-green.svg" class="img-fluid mt-n1"
                                   alt="">
                            </div>
                            <div class="text-14" style="min-width: 120px; width: max-content">
                              {{ item.label }}
                            </div>
                          </div>
                        </div>
                        <div class="text-center mw-400 mx-auto">
                          <button :disabled="showSpinner || passwordInvalid"
                                  class="mt-4 w-100 btn mx-auto btn-primary font-weight-bold"
                                  type="submit">
                            <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                            Register
                          </button>
                        </div>
                      </b-form>
                    </validation-observer>
                  </div>
  
                  <div class="text-center mt-3">Already have a business account?
                    <nuxt-link to="/login" class="text-green cursor-pointer" style="">Log in</nuxt-link>
                  </div>
                </div>
                <!--============-->
  
                <!--=======OTP verification section=====-->
                <div v-else-if="navigator[navigator.length-1].screen ===  'otp'">
                  <OtpInput :numInputs="6" :shouldAutoFocus="true" class="mx-auto justify-content-center"
                            inputClasses="otp-input h6" separator @on-complete="handleOnComplete"
                            @on-change="handleOnChange"/>
                  <div class="text-center mw-400 mx-auto">
                    <button :disabled="!isOTPComplete" class="mt-5 w-100 btn mx-auto btn-primary font-weight-bold"
                            type="button" @click="verifyOTP">
                      <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                      Verify Email
                    </button>
                  </div>
                  <div class="d-flex justify-content-center mx-auto mw-450 mt-3">
                    <div class="cursor-pointer text-grey-600 fw-500 text-14 mr-lg-n5" @click="resendOTP">Didn’t receive
                      any code? <span class="text-green">request again</span></div>
                  </div>
                </div>
                <!--========/OTP Ended-->
  
                <!--==========Verified section -->
                <div class="mw-551 mx-auto" v-if="navigator[navigator.length-1].screen ===  'otp-verified'">
                  <div
                    class="product-benefits p-4 py-md-4 px-md-5 mt-5 d-flex flex-column justify-content-between align-items-center">
                    <div class="top text-center">
                      <img alt="avatar" class="img-fluid rounded-circle" src="/images/icons/suceess-check.svg"
                           style="height:50px">
                      <p class="mt-3">Account successfully created</p>
                    </div>
  
                    <ul class="list-group bg-white pt-5 mt-5 w-100 mt-5 mb-0">
                      <li
                        class="px-0 border-bottom py-3 bg-transparent px-3 d-flex align-items-center justify-content-between m">
                        <span>Business Name:</span>
                        <span class="font-weight-medium text-green">{{ form.business_name }}</span>
                      </li>
                      <li
                        class="px-0 border-bottom py-3 bg-transparent px-3 d-flex align-items-center justify-content-between m">
                        <span> Email:</span>
                        <span class="font-weight-medium">{{ form.business_email }}</span>
                      </li>
                      <li
                        class="px-0 border-bottom py-3 bg-transparent px-3 d-flex align-items-center justify-content-between m">
                        <span>Phone No:</span>
                        <span class="font-weight-medium ">{{ form.business_phone_number }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="text-center mw-400 mx-auto mt-2">
                    <button :disabled="showSpinner" class="mt-md-5 w-100 btn mx-auto btn-primary" type="button"
                            @click="next({screen: 'product-details'})">
                      <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                      Continue
                    </button>
                  </div>
                </div>
  
                <!--Product details Form   -->
                <div class="mw-400 mx-auto mt-4" v-if="navigator[navigator.length-1].screen ===  'product-details'">
  
                  <div
                    v-if="$route.query.p === 'flexicare' || $route.query.p === 'miniflexicare' || $route.query.p === 'zencare' || $route.query.p === 'zencareplus'">
                    <b-form-group description="in months" label="Period of cover">
                      <b-form-select
                        id="period-of-cover"
                        v-model.number="buy_form.cover_period"
                        :options="periods"
                        aria-describedby="period-of-cover-live-feedback"
                        name="period-of-cover"
                        required></b-form-select>
  
                    </b-form-group>
  
                    <b-form-group label="Team Size">
                      <b-input id="beneficiaries"
                               v-model.number.trim="buy_form.quantity"
                               aria-describedby="beneficiaries-live-feedback"
                               min="1"
                               name="beneficiaries" placeholder="10" required type="number"
                               @input="buy_form.quantity < 1 ? buy_form.quantity = 1 : buy_form.quantity"></b-input>
  
                    </b-form-group>
  
                    <b-form-group label="Promo code (optional)" class="d-none">
                      <b-input id="promo-code" class="d-none"
                               v-model="buy_form.promo_code"
                               aria-describedby="promo-code-live-feedback"
                               name="promo-code" placeholder="XXAD123" required type="number"></b-input>
  
                    </b-form-group>
  
                    <b-form-group label="How many staff beneficiaries" v-if="beneficiaryIsActive">
                      <b-input id="beneficiary" v-model="form.beneficiary" aria-describedby="beneficiaries"
                               name="beneficiary" placeholder="Add beneficiary" type="number"/>
                    </b-form-group>
  
                    <div class="text-center">
                      <div v-if="$auth.$state.business" class=" mt-4 pt-4">
                        <div class="py-3 px-4 fw-800 mb-4 text-center" style="background: #E6F4F2; border: 0.5px solid #D0D5DD;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);">
                          {{ currency }}{{ currencify(buy_form.price) }}
                        </div>
                        <button @click="next({screen: 'verify-details'})" class="btn btn-primary w-100 mt-3">Proceed
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <div v-if="$route.query.p === 'deliverycover'">
  
                    <b-form-group label="How Many Delivery Vehicles Do You Have In Your Fleet?">
                      <b-input id="beneficiaries" name="beneficiaries"
                               @input="buy_form.quantity < 1 ? buy_form.quantity = 1 : buy_form.quantity"
                               aria-describedby="beneficiaries-live-feedback" required type="number" min="1"
                               v-model.number.trim="buy_form.quantity" placeholder="10"></b-input>
                    </b-form-group>
  
                    <b-form-group label="Promo code (optional)" class="d-none">
                      <b-input id="promo-code" class="d-none"
                               v-model="buy_form.promo_code"
                               aria-describedby="promo-code-live-feedback"
                               name="promo-code" placeholder="XXAD123" required type="number"></b-input>
                    </b-form-group>
  
                    <div class="text-center">
                      <div v-if="$auth.$state.business" class=" mt-4 pt-4">
                        <div class="py-3 px-4 fw-800 mb-4 text-center" style="background: #E6F4F2; border: 0.5px solid #D0D5DD;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);">
                          {{ currency }}{{ currencify(buy_form.price) }}
                        </div>
                        <button @click="next({screen: 'verify-details'})" class="btn btn-primary w-100 mt-3">Proceed
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <div v-if="$route.query.p === 'monthlycomprehensive'">
                    <div>
                      <b-form-group label="Cover Period (in Months)">
                        <b-input id="cover-period-"
                                 name="cover-period-"
                                 @input="buy_form.cover_period < 1 ? buy_form.cover_period = 1 : buy_form.cover_period"
                                 aria-describedby="cover-period-live-feedback"
                                 required type="number" min="1" v-model.number.trim="buy_form.cover_period"
                                 placeholder="10"></b-input>
                      </b-form-group>
  
                      <div v-for="(item, index) in vehicle_values" :key="index" class="vehicle-container"
                           :id="'vehicle-container'+index"
                           :class="[vehicle_values.length > 1 && index < vehicle_values.length - 1 ? 'active' : '']">
                        <div class="head d-flex justify-content-between px-2"
                             :style="{height: vehicle_values.length > 1 && index < vehicle_values.length - 1 ? '36px' : '0', opacity: vehicle_values.length > 1 && index < vehicle_values.length - 1 ? '1' : '0'}">
                          <div> Vehicle {{ index + 1 }}</div>
                          <div class="px-2 cursor-pointer" @click="toggler(index)">
                            <img src="/images/icons/chevron-down.svg" class="img-fluid" alt="">
                          </div>
                        </div>
                        <div class="body">
                          <b-form-group
                            label="Vehicle Model">
                            <b-input :id="'vehicle-model'+index"
                                     name="vehicle-value"
                                     aria-describedby="vehicle-value-live-feedback"
                                     required type="text" min="1" v-model.trim="vehicle_values[index].vehicle"
                                     placeholder="Toyota Camry"></b-input>
                          </b-form-group>
                          <b-form-group
                            label="Vehicle Value">
                            <b-input :id="'vehicle-value'+index"
                                     name="vehicle-value"
                                     @input="vehicle_values[index].price < 1 ? vehicle_values[index].price = 0 : vehicle_values[index].price"
                                     aria-describedby="vehicle-value-live-feedback"
                                     required type="number" min="1" v-model.number.trim="vehicle_values[index].price"
                                     placeholder="1,000,000"></b-input>
                            <div v-if="vehicle_values.length > 1" class="d-flex justify-content-end">
                              <span class="removal-text" @click="removeVehicle(index)">- Remove Vehicle</span>
                            </div>
                          </b-form-group>
                        </div>
                      </div>
  
                      <div class="text-right mb-3">
                        <span @click="addVehicle" class="add-more-btn fw-600">+ Add Vehicle</span>
                      </div>
  
                      <b-form-group label="Promo code (optional)" class="d-none">
                        <b-input id="promo-code" class="d-none"
                                 v-model="buy_form.promo_code"
                                 aria-describedby="promo-code-live-feedback"
                                 name="promo-code" placeholder="XXAD123" required type="number"></b-input>
                      </b-form-group>
  
                      <div class="text-center">
                        <div v-if="$auth.$state.business" class=" mt-4 pt-4">
                          <div class="py-3 px-4 fw-800 mb-4 text-center" style="background: #E6F4F2; border: 0.5px solid #D0D5DD;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);">
                            {{ currency }}{{ currencify(buy_form.price) }}
                          </div>
                          <button v-if="allVehicleHasValues" class="btn btn-primary w-100 mt-3"
                                  @click="next({screen: 'verify-details'})">
                            Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <div v-if="$route.query.p === 'gadget'">
                    <div>
                      <b-form-group label="Promo code (optional)" class="d-none">
                        <b-input id="promo-code" class="d-none"
                                 v-model="buy_form.promo_code"
                                 aria-describedby="promo-code-live-feedback"
                                 name="promo-code" placeholder="XXAD123" required type="number"></b-input>
                      </b-form-group>
  
                      <div v-for="(item, index) in gadget_values" :key="index" class="vehicle-container"
                           :id="'vehicle-container'+index"
                           :class="[gadget_values.length > 1 && index < gadget_values.length - 1 ? 'active' : '']">
                        <div class="head d-flex justify-content-between px-2"
                             :style="{height: gadget_values.length > 1 && index < gadget_values.length - 1 ? '36px' : '0', opacity: gadget_values.length > 1 && index < gadget_values.length - 1 ? '1' : '0'}">
                          <div> Gadget {{ index + 1 }}</div>
                          <div class="px-2 cursor-pointer" @click="toggler(index)">
                            <img src="/images/icons/chevron-down.svg" class="img-fluid" alt="">
                          </div>
                        </div>
                        <div class="body">
                          <b-form-group
                            label="Device Model">
                            <b-input :id="'device-model'+index"
                                     name="device-value"
                                     aria-describedby="device-value-live-feedback"
                                     required type="text" min="1" v-model.trim="gadget_values[index].gadget"
                                     placeholder="Samsung Galaxy S21 Ultra"></b-input>
                          </b-form-group>
                          <b-form-group
                            label="Gadget Value">
                            <b-input :id="'device-value'+index"
                                     name="device-value"
                                     @input="gadget_values[index].price < 1 ? gadget_values[index].price = 0 : gadget_values[index].price"
                                     aria-describedby="device-value-live-feedback"
                                     required type="number" min="1" v-model.number.trim="gadget_values[index].price"
                                     placeholder="1,000,000"></b-input>
                            <div v-if="gadget_values.length > 1" class="d-flex justify-content-end">
                              <span class="removal-text" @click="removeGadget(index)">- Remove Gadget</span>
                            </div>
                          </b-form-group>
                        </div>
                      </div>
  
                      <div class="text-right mb-3">
                        <span @click="addGadget" class="add-more-btn fw-600">+ Add Gadget</span>
                      </div>
  
  
                      <div class="text-center">
                        <div v-if="$auth.$state.business" class=" mt-4 pt-4">
                          <div class="py-3 px-4 fw-800 mb-4 text-center" style="background: #E6F4F2; border: 0.5px solid #D0D5DD;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);">
                            {{ currency }}{{ currencify(buy_form.price) }}
                          </div>
                          <button v-if="allGadgetsHasValues" class="btn btn-primary w-100 mt-3"
                                  @click="next({screen: 'verify-details'})">
                            Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <div v-if="$route.query.p === 'officecontent'">
  
                    <b-form-group label="How Many Office Locations?">
                      <b-input id="beneficiaries"
                               name="beneficiaries"
                               @input="buy_form.quantity < 1 ? buy_form.quantity = 1 : buy_form.quantity"
                               aria-describedby="beneficiaries-live-feedback"
                               required type="number" min="1" v-model.number.trim="buy_form.quantity"
                               placeholder="10"></b-input>
                    </b-form-group>
  
                    <b-form-group label="Promo code (optional)" class="d-none">
                      <b-input id="promo-code" class="d-none"
                               v-model="buy_form.promo_code"
                               aria-describedby="promo-code-live-feedback"
                               name="promo-code" placeholder="XXAD123" required type="number"></b-input>
                    </b-form-group>
  
                    <div class="text-center">
                      <div v-if="$auth.$state.business" class=" mt-4 pt-4">
                        <div class="py-3 px-4 fw-800 mb-4 text-center" style="background: #E6F4F2; border: 0.5px solid #D0D5DD;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);">
                          {{ currency }}{{ currencify(buy_form.price) }}
                        </div>
                        <button @click="next({screen: 'verify-details'})" class="btn btn-primary w-100 mt-3">Proceed
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <!-- third party starts here -->
                  <div v-if="$route.query.p === 'thirdparty'">
                    <div>
                      <b-form-group label="Cover Period (in Months)">
                        <b-input id="cover-period-"
                                 name="cover-period-"
                                 readonly
                                 aria-describedby="cover-period-live-feedback"
                                 required type="number" min="12"
                                 :value="12"
                                 placeholder="12"></b-input>
                      </b-form-group>
  
                      
                      <div class="body">
                        <b-form-group
                          label="Number of vehicles">
                          <b-input id="vehicle-quantity"
                                   name="vehicle-quantity"
                                   aria-describedby="vehicle-quantity-live-feedback"
                                   required type="number" min="1" v-model.number.trim="buy_form.quantity"
                                   placeholder="1"></b-input>
                        </b-form-group>
                      </div>
  
                      <b-form-group label="Promo code (optional)">
                        <b-input id="promo-code"
                                 v-model="buy_form.promo_code"
                                 aria-describedby="promo-code-live-feedback"
                                 name="promo-code" placeholder="XXAD123" required type="number"></b-input>
                      </b-form-group>
  
                      <div class="text-center">
                        <div v-if="!$auth.$state.business" class=" mt-4 pt-4">
                          <div class="py-3 px-4 fw-800 mb-4 text-center" style="background: #E6F4F2; border: 0.5px solid #D0D5DD;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);">
                            {{ currency }}{{ currencify(thirdPartyActualPrice) }}
                          </div>
                          <button v-if="Boolean(buy_form.quantity)" class="btn btn-primary w-100 mt-3"
                                  @click="next({screen: 'verify-details'})">
                            Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- third party ends here -->
                </div>
                <!--========/End=========-->
  
                <div v-if="navigator[navigator.length-1].screen ===  'verify-details'">
                  <!--======Paystack Gateway-->
                  <div class="my-5 mw-551 mx-auto">
                    <div class="p-4" style="background: #F8FCFB; border: 1px solid #EAECF0; border-radius: 6px;">
                      <div class="bg-white">
                        <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085" class="fw-500">Business</div>
                          <div class="text-capitalize text-14 fw-800">{{ form.business_name }}</div>
                        </div>
                        <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085" class="fw-500">Email</div>
                          <div class="text-capitalize text-14 fw-800">{{ form.business_email }}</div>
                        </div>
                        <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085" class="fw-500">Phone No.</div>
                          <div class="text-capitalize text-14 fw-800">{{ form.business_phone_number }}</div>
                        </div>
                        <div v-if="buy_form.cover_period && !allGadgetsHasValues"
                             class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085" class="fw-500">Period</div>
                          <div class="text-capitalize text-14 fw-800">{{ buy_form.cover_period }}</div>
                        </div>
                        <div
                          v-if="buy_form.quantity && !allVehicleHasValues && !allGadgetsHasValues && $route.query.p !== 'delivery-cover'"
                          class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085" class="fw-500">Team Size</div>
                          <div class="text-capitalize text-14 fw-800">{{ buy_form.quantity }}</div>
                        </div>
                        <div v-if="$route.query.p === 'deliverycover'"
                             class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085" class="fw-500">No of Vehicles</div>
                          <div class="text-capitalize text-14 fw-800">{{ buy_form.quantity }}</div>
                        </div>
                        <div class="d-none" v-if="$route.query.p === 'gadget'">
                          <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                            <div style="color: #667085" class="fw-500">No of Vehicles</div>
                            <div class="text-capitalize text-14 fw-800">{{ vehicle_values.length }}</div>
                          </div>
                          <div v-for="(vehicle, index) in vehicle_values" :key="'vehicle'+index"
                               class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                            <div style="color: #667085" class="fw-500 text-capitalize">{{ vehicle.vehicle }} (vehicle
                              {{ index + 1 }})
                            </div>
                            <div class="text-capitalize text-14 fw-800">{{ currency }}{{
                                currencify(vehicle.price)
                              }}
                            </div>
                          </div>
                        </div>
                        <div v-if="allVehicleHasValues">
                          <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                            <div style="color: #667085" class="fw-500">No of Vehicles</div>
                            <div class="text-capitalize text-14 fw-800">{{ vehicle_values.length }}</div>
                          </div>
                          <div v-for="(vehicle, index) in vehicle_values" :key="'vehicle'+index"
                               class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                            <div style="color: #667085" class="fw-500 text-capitalize">{{ vehicle.vehicle }} (vehicle
                              {{ index + 1 }})
                            </div>
                            <div class="text-capitalize text-14 fw-800">{{ currency }}{{
                                currencify(vehicle.price)
                              }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-4 text-24 fw-700 d-flex justify-content-center align-items-center"
                           style="background: #E6F4F2; border: 0.5px solid #D0D5DD; box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04); height: 55px;">
                        {{ currency }}{{ currencify(buy_form.price) }}
                      </div>
                    </div>
                    <div class="mt-4 px-4">
                      <Paystack :ref="getPaystackReference()" :amount="buy_form.price*100" :callback="buyInsurance"
                                :close="onClose"
                                :email="$auth.$state.business.primary_email" :embed="false"
                                :firstname="$auth.$state.user.first_name" :lastname="$auth.$state.user.last_name"
                                :paystackkey="paystackkey" :reference="getPaystackReference()"
                                class="w-100 bg-transparent border-0 cursor-pointer">
                        <button class="w-100 btn btn-primary font-weight-bold">
                          <b-spinner v-if="showSpinner" class="mr-2" small></b-spinner>
                          All good. Buy Plan
                        </button>
                      </Paystack>
                    </div>
                  </div>
                  <!--======-->
                </div>
  
                <div v-else-if="navigator[navigator.length-1].screen ===  'receipt'" class="container">
                  <div class="mx-auto" style="max-width: 500px">
                    <div class="p-2 p-md-4" style="background: #F8FCFB; border: 1px solid #EAECF0; border-radius: 6px;">
                      <div class="pb-4 text-center">
                        <img alt="" class="img-fluid" style="height: 40px" src="/images/icons/vibarant-green-check.svg">
                      </div>
                      <p class="font-weight-light text-18 fw-500 text-center pb-4" style="color: #344054">Payment received
                        successfully</p>
                      <div class="bg-white">
                        <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085">Amount</div>
                          <div class="text-green fw-700">{{ currency }}{{ currencify(buy_form.price) }}</div>
                        </div>
                        <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085">Payment Method</div>
                          <div class="fw-700 text-capitalize">{{ buy_form.payment_gateway }}</div>
                        </div>
                        <div class="d-flex justify-content-between border-bottom-1 px-4 py-3">
                          <div style="color: #667085">Date</div>
                          <div class="fw-700">{{ dayjs().format('DD MMM YYYY') }}</div>
                        </div>
                      </div>
                    </div>
  
                    <div class="mw-400 mx-auto">
                      <button @click="goToDashboard" class="btn btn-primary w-100 mt-4 mb-4 br-8">
                        <span class="font-weight-medium">Go to your Dashboard</span>
                      </button>
                    </div>
  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <div class="row align-items-center justify-content-center" style="height: 100vh">
          <div class="col-md-3 mb-4" v-for="i in 4">
            <b-skeleton width="100%" height="100px"></b-skeleton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Paystack from 'vue-paystack';
  import dayjs from 'dayjs'
  import OtpInput from "@bachdgvn/vue-otp-input";
  import McaIcons from "~/components/icons/mca-icons";
  
  import LearnMore from "~/components/blocks/learn-more";
  import ZenTab from "~/components/blocks/ZenTab";
  import Extra from "@/components/blocks/Extra";
  import Modal from "@/components/blocks/modal";
  import BenefitTable from "~/components/blocks/BenefitTable";
  import {data} from "/assets/data/data"
  
  export default {
    name: "register",
    scrollToTop: true,
    auth: false,
    components: {LearnMore, McaIcons, OtpInput, Paystack, ZenTab, Extra, Modal, BenefitTable},
    data() {
      return {
        dayjs,
        notifyWatch: "",
        promptUnlockingPrice: false,
        navigator: [
          {
            screen: 'select-product'
          },
          {
            screen: 'select-product'
          },
          {
            screen: 'product-details'
          }
        ],
        passwordValidation: [
          {
            label: '8 characters long',
            status: false
          },
          {
            label: 'One lower case',
            status: false
          },
          {
            label: 'One upper case',
            status: false
          },
          {
            label: 'A number and special character',
            status: false
          },
        ],
        selected: null,
        selectedProd: '0+0',
        show: false,
        stage: 0,
        steps: [
          {
            title: 'Your Details',
            stage: 0,
            stages: 1
          },
          {
            title: 'Plan Details',
            stage: 3,
            stages: 3,
          },
          {
            title: 'Get Covered',
            stage: 4,
            stages: 1,
          },
        ],
        activeIndex: 0,
        paid: false,
        isOTP: false,
        verifyDetails: false,
        showSpinner: false,
        isPassword: true,
        passwordInvalid: true,
        isLogin: false,
        isOTPComplete: false,
        isOTPInvalid: false,
        otpValue: "",
        isOTPVerified: false,
        beneficiaryIsActive: false,
        timer: 1000 * 40,
        isRetry: false,
        isWaitingForTimer: false,
        form: {
          first_name: "",
          last_name: "",
          business_email: "",
          business_name: "",
          business_phone_number: "",
          business_address: "",
          beneficiary: 0,
          business_state_of_residence: "",
          business_city_of_residence: "",
          business_sector: "",
          password: "",
        },
        sectors: [
          'Agriculture',
          'Commerce',
          'Education',
          'Fashion',
          'Fintech',
          'Food',
          'Health',
          'Hospitality',
          'Insurance',
          'Logistics',
          'Non-profit',
          'Restaurant',
          'Sports',
          'Tech',
          'Travel',
          'Other'
        ],
        amount: 0,
        buy_form: {
          quantity: 1,
          cover_period: 1,
          promo_code: '',
          price: 0,
          payment_gateway: 'paystack',
          product_id: 0
        },
        vehicle_values: [{vehicle: '', price: 0}],
        gadget_values: [{gadget: '', price: 0}],
        totalAmount: 0,
        cities: [],
        plan_id: 0,
        selected_method: null,
        isNotProduct: false,
        show_tabs: false,
        show_info: false,
        paystackkey: process.env.NODE_ENV === 'development' ? process.env.PAYSTACK_TEST_PUBLIC : process.env.PAYSTACK_PUBLIC_KEY,
        zenTabSelected: 'zencare'
      }
    },
    computed: {
      periods() {
        return data.periods
      },
      states() {
        return data.states;
      },
      benefits() {
        return data.productBenefits
      },
      currency() {
        return this.$store.getters['main/getCurrency'].symbol;
      },
      isLoading() {
        return this.$store.getters['main/getIsLoading'];
      },
      thirdPartyActualPrice() {
        return 15000 * this.buy_form.quantity
      },
      canAddVehicle() {
        return this.vehicle_values.every(({price}) => parseInt(price) >= 1000000)
      },
      intro_message() {
        return {
          'product-benefit': {
            t: '<span class="fw-700 text-green text-28">Welcome to MyCoverGenius</span>',
            d: this.benefits[this.$route.query?.p]?.desc
          },
          'buy-one': {
            t: 'What can I call you?',
            d: 'Tell me your name below'
          },
          'buy-two': {
            t: `Awesome! Glad to meet you, ${this.form?.first_name}`,
            d: 'Tell me a bit about your business'
          },
          'buy-three': {
            t: `How can I reach you?`,
            d: 'Give me your business contact'
          },
          'buy-four': {
            t: `Where’s ${this.form?.business_name} located?`,
          },
          'buy-five': {
            t: 'Almost in. Create password',
            d: 'Secure your new account with a strong password. <br> For your eyes only.'
          },
          'buy-six': {
            t: '',
            d: ''
          },
          'otp': {
            t: '<span class="text-green">Great</span>, let’s verify you',
            d: `We sent a 6-digit code sent to <span class="fw-700">${this.form?.business_email}</span> <span> <br>
  <img src="/images/icons/info-i.svg" style="height: 14px" class="img-fluid" alt="">
  </span>Check your mail inbox or spam folder for the code.`
          },
          'otp-verified': {
            t: "Account <span class='text-green'>Created</span>"
          },
          'product-details': {
            t: 'Let’s get your business covered',
            d: this.benefits[this.$route.query?.p]?.tag
          },
          'verify-details': {
            t: 'Let’s get your business <span class="tet-green">covered</span>  ',
            d: `Hey ${this.form?.first_name}, look through your plan details below`,
          },
          'receipt': {
            t: 'Payment received successfully!',
            d: ``,
          },
        }
      },
      allVehicleHasValues() {
        return this.vehicle_values.every(e => (e.price !== 0 && e.price >= 1000000))
      },
      allGadgetsHasValues() {
        return this.gadget_values.every(e => (e.price !== 0 && e.price >= 100000))
      },
      products() {
        return this.$store.state.main.products
      },
    },
    async created() {
      !this.$route.query.p ? this.isNotProduct = true : null;
    },
    mounted() {
      this.$store.dispatch("main/getProducts",)
      this.logout()
      this.setDefault();
      // if (this.$route.query.p) this.navigator.push({screen: 'product-benefit'})
      setTimeout(() => {
        this.setProductFromQuery();
        this.show_tabs = true
      }, 2000);
    },
    methods: {
      setProductFromQuery() {
        this.products.forEach(category => {
          let ch = category.children.filter(child => {
            return child.form_name === this.$route.query.p
          });
  
          if (ch.length > 0) {
            this.selected = ch[0];
            this.buy_form.product_id = ch[0].id;
  
            setTimeout(() => {
              if (ch[0].id === this.selected?.alternative) {
                this.buy_form.price = this.selected?.alternative_price?.default_price ?? 0
              } else {
                this.buy_form.price = this.selected?.price?.default_price ?? 0;
              }
  
            }, 500)
          }
        })
      },
      replaceText(text, price) {
        if (!text) return;
        if (text.includes('mcg_price') && price?.default_price) return text.replace('mcg_price', price?.default_price)
        else return text;
      },
      goToDashboard() {
        this.$store.commit('main/setPurchase', {
          path: `/plans/plan-details/${this.plan_id}`,
          name: this.$route.query.p,
          isNewPurchase: true
        })
        this.$router.push('/')
      },
      close() {
        this.show = false
      },
      trackTab(e) {
        this.zenTabSelected = e
      },
      toggler(index) {
        document.querySelector(`#vehicle-container${index}`).classList.toggle('active')
      },
      selectProduct(index, i) {
        this.selectedProd = `${index}+${i}`;
        //Add the selected product form name to the query parameter
        this.$router.push(`/register?p=${this.products[index].children[i].form_name}`)
        //TODO price must reflect alternative product selected
        if (this.products[index].children[i]?.alternative_price) {
          this.buy_form.price = this.products[index].children[i]?.alternative_price?.default_price
          this.buy_form.product_id = this.products[index].children[i]?.alternative_price?.product_id
        } else if (this.products[index].children[i]?.price) {
          this.buy_form.price = this.products[index].children[i]?.price?.default_price
          this.buy_form.product_id = this.products[index].children[i]?.price?.product_id
        }
        this.show_info = false
        this.setProductId(index, i)
        setTimeout(() => this.show_info = true, 2000)
      },
      setProductId(index, i) {
        this.selected = this.products[index].children[i]
        this.buy_form.product_id = this.products[index].children[i].id;
      },
      setDefault() {
        this.amount = this.buy_form.price * 100
      },
      async watchUnlockingPrice(proceed) {
        let i = this.benefits[this.$route.query.p];
        this.notifyWatch = i?.notice.active ? 'You are switching off the no-waiting period' : `Switching to the No-waiting period lets you unlock all the benefits early on. This would cost an extra ${i?.notice.fee.toLocaleString()} to your plan.`;
        this.promptUnlockingPrice = !this.promptUnlockingPrice;
        if (proceed) {
          let initial = this.buy_form.price;
          //Add to the price of the selected product in the form.
          if (i?.notice.active) {
            this.buy_form.price = this.selected.price.default_price
            this.buy_form.product_id = this.selected.price.product_id
          } else {
            this.buy_form.price = this.selected.alternative_price.default_price;
            this.buy_form.product_id = this.selected.alternative_price.product_id
          }
          let info = initial < this.buy_form.price ? `Waiting period Unlocked, your premium is now ${this.buy_form.price.toLocaleString()}/month` : `Waiting period locked, your premium is now ${this.buy_form.price.toLocaleString()}/month`
          await this.$store.dispatch("notifications/showNotification", {type: 'success', content: info})
        } else {
          this.$store.commit("main/toggleExtraFee", this.$route.query.p);
        }
        this.amount = this.buy_form.price * 100
      },
      unwatchUnlockingPrice() {
        this.promptUnlockingPrice = !this.promptUnlockingPrice;
        this.$store.commit("main/toggleExtraFee", this.$route.query.p);
      },
      logout() {
        try {
          this.$auth.logout()
          this.$auth.$storage.removeUniversal('token')
          this.$auth.$storage.removeUniversal('user')
          this.$auth.$storage.removeUniversal('business')
        } catch (e) {
          this.$auth.logout()
          this.$auth.$storage.removeUniversal('token')
          this.$auth.$storage.removeUniversal('user')
          this.$auth.$storage.removeUniversal('business')
        }
      },
      currencify(value) {
        return value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      },
      getValidationState({dirty, validated, valid = null}) {
        return dirty || validated ? valid : null;
      },
      handleOnComplete(value) {
        this.isOTPComplete = true
        this.otpValue = value
      },
      handleOnChange(value) {
        this.isOTPInvalid = false
        this.otpValue = value
        if (value.length < 4) this.isOTPComplete = false
      },
      addBeneficiary() {
        this.$bvModal.hide('–add-beneficiary')
        this.$bvModal.show('upload-type')
      },
      showLogin() {
        this.isLogin = !this.isLogin
      },
      togglePassword() {
        this.isPassword = !this.isPassword
      },
      async toggleExtraFee() {
        let i = this.benefits[this.$route.query.p];
        this.$store.commit("main/toggleExtraFee", this.$route.query.p);
        //Add to the price of the selected product in the form.
        this.buy_form.price = i?.notice.active ? i.notice.fee + this.buy_form.price : this.buy_form.price - i.notice.fee;
  
        if (i?.notice.active) await this.$store.dispatch("notifications/showNotification", {
          type: 'success',
          content: `Waiting period Unlocked, your ${this.$route.query.p} now is ${this.buy_form.price}/month`
        });
        else await this.$store.dispatch("notifications/showNotification", {
          type: 'success',
          content: `Waiting period has been restored back, your ${this.$route.query.p} is ${this.buy_form.price}/month`
        });
      },
      validateVehicleValues() {
        this.$store.dispatch('notifications/showNotification', {
          content: 'All vehicle values are required and must be at least 1,000,000',
          type: 'error'
        })
      },
      formatRouteQuery() {
        console.log(this.$route.query.p.toLowerCase())
        return this.$route.query.p.toLowerCase()
      },
      async verifyOTP() {
        const ctx = this
        this.showSpinner = true
        this.isOTPInvalid = false
        try {
          this.$api.user.verifyOTP({
            email: this.form.business_email,
            otp: this.otpValue
          }).then(async res => {
            this.isOTPVerified = true;
            await ctx.login();
          }).catch(err => {
            this.showSpinner = false
            this.$store.dispatch('notifications/showNotification', {content: err.response.data.errors[0], type: 'error'})
          })
        } catch (err) {
          this.showSpinner = false
          this.isOTPInvalid = true
        }
  
      },
      onClose() {
        this.$store.dispatch('notifications/showNotification', {content: 'Payment Cancelled.', type: 'error'})
      },
      getPaystackReference() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        const ref = "covergenius_" + text + Date.now();
        this.buy_form.reference = ref;
        this.buy_form.payment_gateway = 'paystack';
        return ref
      },
      async buyInsurance() {
        try {
          if (this.formatRouteQuery() === "monthlycomprehensive") this.buy_form.item_values = this.vehicle_values.map(vehicle => vehicle.price)
          if (this.formatRouteQuery() === 'gadget') this.buy_form.item_values = this.gadget_values.map(gadget => gadget.price)
          let res = await this.$api.plans.buyFlexicare(this.buy_form)
          this.$emit('cancel')
          this.$bvModal.hide('proceed-payment')
          this.$bvModal.show('add-beneficiary')
          this.showSpinner = false;
          if (res.status !== 'error') {
            this.paid = true;
            this.plan_id = res.data.purchase_id
            this.$emit('plan', res.data.purchase_id)
            this.$emit('quantity', this.buy_form.quantity)
            await this.$store.dispatch('notifications/showNotification', {
              content: res.data.message,
              type: 'success'
            });
            this.goToDashboard();
  
          } else {
            await this.$store.dispatch('notifications/showNotification', {content: res.data[0], type: 'error'})
          }
        } catch (e) {
          await this.$store.dispatch('notifications/showNotification', {content: e, type: 'error'})
        }
      },
      next(screen, increment) {
        this.showSpinner = true;
        return setTimeout(() => {
          //Show the section of the selected products
          if (this.navigator[this.navigator.length - 1].screen !== screen.screen) this.navigator.push(screen);
          this.showSpinner = false;
          if (screen.screen !== 'verify-details') {
            this.setDefault()
          }
        }, 500);
      },
      prev() {
        if (this.navigator[this.navigator.length - 1].min < this.activeIndex) --this.activeIndex
        else {
          this.navigator.pop();
          //Added this to prevent showing the benefit by default if a user mistakenly refreshes
          if (this.navigator.length === 1) {
            this.selectedProd = "";
            this.$router.push("/register");
          }
        }
      },
      addVehicle() {
        this.canAddVehicle && this.vehicle_values.push({vehicle: '', price: 0})
      },
      addGadget() {
        this.gadget_values.push({gadget: '', price: 0})
      },
      removeVehicle(index) {
        this.vehicle_values.splice(index, 1)
      },
      removeGadget(index) {
        this.gadget_values.splice(index, 1)
      },
      async resendOTP() {
        const res = await this.$api.user.resendOTP({email: this.form.business_email})
        if (res.status !== 'error') {
          this.isOTP = true
          await this.$store.dispatch('notifications/showNotification', {
            content: 'An OTP has been sent to your business email',
            type: 'success'
          })
        } else {
          this.isOTP = true
          await this.$store.dispatch('notifications/showNotification', {
            content: "Error sending OTP",
            type: 'error'
          })
        }
        this.isOTP = true
      },
      async getBusinessInfo() {
        this.showSpinner = true
        let res = await this.$api.user.getBusinessDetailsInfo()
        await this.$auth.$storage.setUniversal('business', res.data.business)
        if (res.status.toLowerCase() !== 'success') {
          await this.$store.dispatch('notifications/showNotification', {content: res.errors[0], type: 'error'})
        }
        this.showSpinner = false
      },
      async login() {
        this.showSpinner = true
        this.form.email = this.form.business_email
        try {
          let response = await this.$auth.loginWith('local', {
            data: this.form
          });
  
          if (response.data.status === 'success') {
            await this.$auth.$storage.setUniversal('business', response.data.business)
            await this.$auth.$storage.setUniversal('user', response.data.data.user)
            await this.$auth.$storage.setUniversal('token', response.data.data['access_token'])
            await this.getBusinessInfo();
            this.isOTPVerified = true
            this.navigator.push({screen: 'otp-verified'});
            // this.navigator.push({screen: 'product-details'})
            // this.activeIndex = 5
            this.activeIndex = 6
          } else {
            await this.$store.dispatch('notifications/showNotification', {
              content: response.data.errors[0],
              type: 'error'
            })
            this.showSpinner = false
          }
  
        } catch (e) {
          await this.$store.dispatch('notifications/showNotification', {
            content: e.response.data.message ? e.response.data.message : e.response.data.errors[0],
            type: 'error'
          })
          this.showSpinner = false
        }
      },
      async registerBusiness() {
        this.form.password_confirmation = this.form.password
        this.showSpinner = true;
  
        try {
          localStorage.removeItem('vuex');
          const res = await this.$api.user.register(this.form)
          if (res.status !== 'error') {
            //conversion tag
            // gtag('event', 'conversion', {'send_to': 'AW-10859188675/BZHACJLm1-EDEMOjiLoo'});
            //facebook signup
            // fbq('track', 'SignUps',);
            this.showSpinner = false
            ++this.activeIndex
            this.navigator.push({screen: 'otp'})
            await this.resendOTP();
            await this.$store.dispatch('notifications/showNotification', {
              content: 'An OTP has been sent to your business email',
              type: 'success'
            })
          } else {
            this.showSpinner = false
            await this.$store.dispatch('notifications/showNotification', {
              content: res.data[0],
              type: 'error'
            });
          }
        } catch (e) {
          this.showSpinner = false;
          console.log(e)
          await this.$store.dispatch('notifications/showNotification', {
            content: e.response || 'Something went wrong, try again later',
            type: 'error'
          })
        }
      },
    },
    watch: {
      isLoading() {
        this.setProductFromQuery()
      },
      formatRouteQuery(product) {
        if (product === 'deliverycover') {
          this.buy_form.price = 36375
          this.amount = this.buy_form.price * 100
        }
      },
      'form.password'(password) {
        this.passwordValidation[0].status = password.length >= 8;
        this.passwordValidation[1].status = /[a-z]/.test(password);
        this.passwordValidation[2].status = /[A-Z]/.test(password);
        this.passwordValidation[3].status = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
        this.passwordInvalid = !(this.passwordValidation[0].status && this.passwordValidation[1].status && this.passwordValidation[2].status && this.passwordValidation[3].status);
      },
      'form.business_state_of_residence'(val) {
        this.states.filter(x => {
          if (x.text.toLowerCase() === val.toLowerCase()) {
            this.cities = x.lgas
            return x.lgas
          } else return []
  
        })
      },
      'buy_form.quantity'(qty) {
        let product = this.formatRouteQuery()
        if (product === 'flexicare' || product === 'miniflexicare') {
          this.buy_form.price = this.selected.price.default_price * qty * this.buy_form.cover_period;
        }
        if (product === 'zencare' || product === 'zencareplus') {
          this.buy_form.price = this.buy_form.product_id !== this.selected.alternative ? this.selected.price.default_price * qty * this.buy_form.cover_period : this.selected.alternative_price.default_price * qty * this.buy_form.cover_period
        }
        if (product === 'deliverycover') {
          this.buy_form.price = this.buy_form.price * qty
        }
        this.amount = this.buy_form.price * 100;
      },
      'buy_form.cover_period'(period) {
        let product = this.formatRouteQuery()
        if (product === 'flexicare' || product === 'miniflexicare') this.buy_form.price = this.selected.price.default_price * period * this.buy_form.quantity
        if (product === 'zencare' || product === 'zencareplus') {
          this.buy_form.price = this.buy_form.product_id !== this.selected.alternative ? this.selected.price.default_price * period * this.buy_form.quantity : this.selected.alternative_price.default_price * period * this.buy_form.quantity
        }
        if (product === "monthlycomprehensive") {
          let sum = 0
          this.vehicle_values.forEach(val => {
            sum += parseInt(val.price)
          })
          this.buy_form.price = Math.ceil(this.buy_form.price * 0.0035 * sum * period)
          this.buy_form.quantity = this.vehicle_values.length
          this.amount = this.buy_form.price * 100
        }
      },
      vehicle_values: {
        deep: true,
        handler(vehicle_values) {
          if (this.formatRouteQuery() === "monthlycomprehensive") {
            let sum = 0
            vehicle_values.forEach(val => {
              sum += parseInt(val.price)
            })
            this.buy_form.price = Math.round(this.buy_form.price * 0.00375 * sum * this.buy_form.cover_period)
            this.buy_form.quantity = vehicle_values.length
            this.amount = this.buy_form.price * 100
          }
        }
      },
      gadget_values: {
        deep: true,
        handler(gadget_values) {
          if (this.formatRouteQuery() === 'gadget') {
            let sum = 0
            gadget_values.forEach(val => {
              sum += parseInt(val.price)
            })
            this.buy_form.price = Math.round(gadget_values.length * 0.05 * sum * this.buy_form.cover_period)
            this.buy_form.quantity = gadget_values.length
            this.amount = this.buy_form.price * 100
          }
        }
      },
    }
  }
  
  </script>
  
  <style scoped>
  .selected {
    background: white;
    border-radius: 4px;
    border: 0.6px solid #12B76A;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.08);
  }
  
  .desc {
    background-color: #ebe9fe;
  }
  
  .not-selected {
    background: white;
    border-radius: 4px;
    border: 0.4px solid #98A2B3;
  
  }
  
  .not-selected-circle {
    border: 0.830998px solid #667085;
    border-radius: 83.0998px;
  }
  
  .selected-circle {
    border: 0.830998px solid #12B76A;
    border-radius: 83.0998px;
  }
  
  .selected-circle div {
    background: #12B76A;
    border-radius: 100%;
  }
  
  .r-16 {
    width: 16px;
    height: 16px;
  }
  
  form {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .mw-450 {
    max-width: 450px;
  }
  
  
  .icon-circle {
    width: 56px;
    height: 56px;
    color: #439687;
    background: #EAECF0;
  }
  
  .icon-circle.active {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.16);
  }
  
  
  .shadow {
    border: 0.6px solid #98A2B3;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
  }
  
  .filter-white {
    filter: brightness(0) invert(1);
  }
  
  .mt-n1 {
    margin-top: -1px !important;
  }
  
  @media all and (max-width: 768px) {
    .shadow {
      box-shadow: none !important;
    }
  
    .text-30 {
      font-size: 20px !important;
    }
  }
  
  .removal-text {
    color: darkred;
    font-size: 12px;
    cursor: pointer;
  }
  
  .add-more-btn {
    border: none;
    color: #3F8D7F;
    cursor: pointer;
    font-size: 14px;
    border-radius: 10px;
    margin: 1em 0 2em 0 !important;
  }
  
  .bg-side {
    background-color: #347469;
    background-image: url(/images/frames.svg);
    background-size: 380px;
    background-position-y: 105%;
    background-repeat: no-repeat;
  }
  
  .go-back {
    background: #E6F4F2;
    border-radius: 12px;
    width: 108px;
    height: 40px;
    padding: 8px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .form-control:focus {
    border: 1px solid #4FBFA3 !important;
  }
  
  .border-bottom-1 {
    border-bottom: 0.5px solid #F2F4F7 !important;
  }
  
  .formal-input {
    border-radius: 4px;
  }
  
  .formal-input .form-control:focus {
    border: transparent !important;
  }
  
  .formal-input:focus {
    border: 1px solid #4FBFA3 !important;
  }
  
  .otp-input:focus, .otp-input:focus-visible {
    border: 1px solid #4FBFA3 !important;
    outline: none !important;
  }
  
  a, a:hover {
    color: #439687;
  }
  
  .btn-primary {
    border-radius: 8px;
  }
  
  .custom-select {
    height: 44px !important;
    border-radius: 4px !important;
  }
  
  .product-benefits {
    background: #F8FCFB;
    border: 1px solid #EAECF0;
    border-radius: 6px;
  }
  
  .sm-btn-group {
    display: flex;
  }
  
  .btn-group {
    min-width: 80px;
    background: #3e1c9629;
    padding: 6px 10px;
  }
  
  .btn-group .btn {
    height: 25px;
    line-height: 25px;
    padding: 0 0.3rem !important;
  }
  
  .rounded-2 {
    border-radius: 5.5714px;
  }
  
  .bg-purple {
    background-color: #3E1C96;
    color: var(--white);
  }
  
  .plain-tabs .nav-tabs .nav-link {
    background-color: #fff !important;
  }
  
  
  .desc {
    background-color: #EBE9FE !important;
  }
  </style>
  