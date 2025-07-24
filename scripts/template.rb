class TwineToYoto < Formula
    desc "Convert Twine/Twee documents to TweeJSON and YotoJSON"
    homepage "https://github.com/yotoplay/twine-to-yoto"
    version "{{VERSION}}"
  
    on_macos do
      if Hardware::CPU.arm?
        url "{{ARM64_URL}}"
        sha256 "{{ARM64_SHA}}"
      else
        url "{{X64_URL}}"
        sha256 "{{X64_SHA}}"
      end
    end
  
    def install
      bin.install "twine2yoto"
    end
  
    test do
      system "#{bin}/twine2yoto", "--help"
    end
  end