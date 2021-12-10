import Vue from 'vue'
import Adsbygoogle from '<%= relativeToBuild(options.component) %>'

Vue.component('<%= options.alias %>', Adsbygoogle)
